import torch
from transformers import AutoProcessor, AutoModel
from PIL import Image
import logging
from typing import List, Dict, Any, Optional
import requests
from io import BytesIO
import warnings

from configs.model_config import MedSigLIPConfig

logger = logging.getLogger(__name__)


class MedSigLIPModel:
    """Google's Med-SigLIP model for medical image analysis and text-image retrieval"""

    def __init__(self, config: MedSigLIPConfig):
        self.config = config
        self.model = None
        self.processor = None
        self.is_initialized = False
        self.logger = logging.getLogger(__name__)

    def initialize(self):
        """Initialize the Med-SigLIP model"""
        try:
            self.logger.info("🔄 Initializing Med-SigLIP model...")

            # Suppress warnings
            warnings.filterwarnings("ignore", category=UserWarning)

            # Load processor and model
            self.processor = AutoProcessor.from_pretrained(
                self.config.model_name,
                cache_dir=self.config.cache_dir
            )

            self.model = AutoModel.from_pretrained(
                self.config.model_name,
                cache_dir=self.config.cache_dir,
                device_map=self.config.device_map
            )

            self.model.eval()
            self.is_initialized = True
            self.logger.info("✅ Med-SigLIP model initialized successfully!")

        except Exception as e:
            self.logger.error(f"❌ Failed to initialize Med-SigLIP model: {e}")
            raise

    def analyze_medical_image(self, image: Image.Image,
                              analysis_type: str = "general") -> Dict[str, Any]:
        """
        Analyze medical image and provide insights

        Args:
            image: PIL Image object
            analysis_type: Type of analysis ("general", "xray", "mri", "ct", "skin", "ultrasound")
        """
        if not self.is_initialized:
            raise RuntimeError("Med-SigLIP model not initialized")

        try:
            # Prepare text queries based on analysis type
            text_queries = self._get_analysis_queries(analysis_type)

            # Process inputs
            inputs = self.processor(
                text=text_queries,
                images=image,
                padding=True,
                return_tensors="pt"
            ).to(self.model.device)

            # Get model outputs
            with torch.no_grad():
                outputs = self.model(**inputs)

            # Calculate similarity scores
            logits_per_image = outputs.logits_per_image
            probs = logits_per_image.softmax(dim=1)

            # Get top predictions
            top_probs, top_indices = torch.topk(probs, k=3, dim=1)

            results = []
            for i in range(top_indices.shape[1]):
                idx = top_indices[0, i].item()
                prob = top_probs[0, i].item()
                results.append({
                    "description": text_queries[idx],
                    "confidence": prob,
                    "analysis_type": analysis_type
                })

            # Generate comprehensive analysis
            analysis = self._generate_comprehensive_analysis(results, analysis_type)

            return {
                "analysis": analysis,
                "top_findings": results,
                "analysis_type": analysis_type,
                "success": True
            }

        except Exception as e:
            self.logger.error(f"❌ Error analyzing medical image: {e}")
            return {
                "analysis": "Unable to analyze the medical image at this time.",
                "top_findings": [],
                "analysis_type": analysis_type,
                "success": False,
                "error": str(e)
            }

    def classify_skin_condition(self, image: Image.Image) -> Dict[str, Any]:
        """Specialized analysis for skin conditions"""
        skin_queries = [
            "healthy skin with no abnormalities",
            "skin rash with redness and irritation",
            "acne vulgaris with inflamed pustules",
            "eczema with dry scaly patches",
            "psoriasis with silvery scales",
            "skin infection with pus and swelling",
            "allergic reaction with hives",
            "fungal infection with circular rash",
            "benign mole with regular borders",
            "suspicious lesion with irregular shape",
            "burn injury with blistering",
            "contact dermatitis with redness"
        ]

        return self._custom_image_analysis(image, skin_queries, "skin_condition")

    def analyze_xray(self, image: Image.Image, xray_type: str = "chest") -> Dict[str, Any]:
        """Specialized analysis for X-ray images"""
        if xray_type == "chest":
            queries = [
                "normal chest x-ray with clear lung fields",
                "pneumonia with lung consolidation",
                "pulmonary edema with fluid in lungs",
                "pneumothorax with collapsed lung",
                "pleural effusion with fluid around lungs",
                "lung mass or tumor visible",
                "fractured ribs visible",
                "cardiomegaly with enlarged heart",
                "chronic obstructive pulmonary disease changes",
                "tuberculosis with lung cavities"
            ]
        else:
            queries = [
                "normal bone structure without fractures",
                "fracture line visible in bone",
                "arthritis with joint space narrowing",
                "bone dislocation or misalignment",
                "osteoporosis with decreased bone density",
                "bone infection or osteomyelitis",
                "bone tumor or lesion visible",
                "soft tissue swelling around bone"
            ]

        return self._custom_image_analysis(image, queries, f"xray_{xray_type}")

    def analyze_mri_ct(self, image: Image.Image, scan_type: str = "brain") -> Dict[str, Any]:
        """Specialized analysis for MRI/CT scans"""
        if scan_type == "brain":
            queries = [
                "normal brain mri without abnormalities",
                "brain tumor with mass effect",
                "stroke with ischemic changes",
                "intracranial hemorrhage visible",
                "multiple sclerosis with white matter lesions",
                "brain atrophy with ventricular enlargement",
                "hydrocephalus with enlarged ventricles",
                "normal brain ct scan",
                "subdural hematoma visible",
                "cerebral edema with midline shift"
            ]
        else:
            queries = [
                "normal abdominal scan without masses",
                "liver lesion or mass visible",
                "kidney stones or calculi",
                "abdominal aortic aneurysm",
                "appendicitis with inflammation",
                "intestinal obstruction with dilated loops",
                "pancreatitis with pancreatic inflammation"
            ]

        return self._custom_image_analysis(image, queries, f"{scan_type}_scan")

    def _get_analysis_queries(self, analysis_type: str) -> List[str]:
        """Get appropriate text queries for different analysis types"""
        query_templates = {
            "general": [
                "normal medical image without abnormalities",
                "abnormal findings requiring medical attention",
                "inflammatory changes visible",
                "infectious process evident",
                "traumatic injury visible",
                "degenerative changes present",
                "congenital abnormality visible",
                "neoplastic growth or tumor"
            ],
            "skin": [
                "healthy skin without lesions",
                "inflammatory skin condition",
                "infectious skin disease",
                "benign skin growth",
                "malignant skin lesion",
                "allergic skin reaction",
                "autoimmune skin disorder"
            ],
            "xray": [
                "normal x-ray without fractures",
                "bone fracture visible",
                "pulmonary pathology present",
                "cardiac enlargement visible",
                "pleural abnormality present",
                "soft tissue swelling visible"
            ],
            "mri": [
                "normal mri scan",
                "brain pathology visible",
                "spinal abnormality present",
                "joint pathology evident",
                "soft tissue mass visible"
            ],
            "ct": [
                "normal ct scan",
                "abdominal pathology visible",
                "thoracic abnormality present",
                "vascular abnormality visible",
                "traumatic injury evident"
            ]
        }

        return query_templates.get(analysis_type, query_templates["general"])

    def _custom_image_analysis(self, image: Image.Image,
                               queries: List[str],
                               analysis_type: str) -> Dict[str, Any]:
        """Perform custom image analysis with specific queries"""
        try:
            inputs = self.processor(
                text=queries,
                images=image,
                padding=True,
                return_tensors="pt"
            ).to(self.model.device)

            with torch.no_grad():
                outputs = self.model(**inputs)

            logits_per_image = outputs.logits_per_image
            probs = logits_per_image.softmax(dim=1)

            top_probs, top_indices = torch.topk(probs, k=min(3, len(queries)), dim=1)

            results = []
            for i in range(top_indices.shape[1]):
                idx = top_indices[0, i].item()
                prob = top_probs[0, i].item()
                results.append({
                    "finding": queries[idx],
                    "confidence": prob
                })

            analysis = self._generate_specialized_analysis(results, analysis_type)

            return {
                "analysis": analysis,
                "findings": results,
                "analysis_type": analysis_type,
                "success": True
            }

        except Exception as e:
            self.logger.error(f"❌ Error in custom image analysis: {e}")
            return {
                "analysis": f"Unable to perform {analysis_type} analysis.",
                "findings": [],
                "analysis_type": analysis_type,
                "success": False,
                "error": str(e)
            }

    def _generate_comprehensive_analysis(self, findings: List[Dict], analysis_type: str) -> str:
        """Generate comprehensive analysis text from findings"""
        if not findings:
            return "No significant findings detected in the image."

        top_finding = findings[0]
        confidence = top_finding['confidence']

        analysis_parts = []

        if confidence > 0.7:
            analysis_parts.append(
                f"The analysis suggests: {top_finding['description']} (confidence: {confidence:.2f}).")
        elif confidence > 0.5:
            analysis_parts.append(f"Possible finding: {top_finding['description']} (confidence: {confidence:.2f}).")
        else:
            analysis_parts.append(
                f"Unclear findings detected. Top possibility: {top_finding['description']} (confidence: {confidence:.2f}).")

        # Add medical disclaimer
        analysis_parts.append(
            "\n⚠️ Important: This AI analysis is for informational purposes only and should not replace professional medical diagnosis. Please consult with a qualified healthcare provider for accurate diagnosis and treatment.")

        return " ".join(analysis_parts)

    def _generate_specialized_analysis(self, findings: List[Dict], analysis_type: str) -> str:
        """Generate specialized analysis for specific medical imaging types"""
        if not findings:
            return f"No specific {analysis_type.replace('_', ' ')} findings detected."

        primary_finding = findings[0]
        confidence = primary_finding['confidence']

        analysis = f"Based on the {analysis_type.replace('_', ' ')} analysis:\n\n"
        analysis += f"Primary finding: {primary_finding['finding']} (confidence: {confidence:.2f})\n\n"

        if len(findings) > 1:
            analysis += "Other considerations:\n"
            for i, finding in enumerate(findings[1:], 1):
                analysis += f"- {finding['finding']} (confidence: {finding['confidence']:.2f})\n"

        analysis += "\n🔬 Medical Note: This analysis is automated and should be verified by a qualified radiologist or healthcare professional."

        return analysis

    def load_image_from_path(self, image_path: str) -> Image.Image:
        """Load image from file path"""
        try:
            return Image.open(image_path).convert('RGB')
        except Exception as e:
            raise ValueError(f"Error loading image from {image_path}: {e}")

    def load_image_from_url(self, image_url: str) -> Image.Image:
        """Load image from URL"""
        try:
            response = requests.get(image_url, timeout=10)
            response.raise_for_status()
            return Image.open(BytesIO(response.content)).convert('RGB')
        except Exception as e:
            raise ValueError(f"Error loading image from URL {image_url}: {e}")

    def __del__(self):
        """Cleanup model from memory"""
        if hasattr(self, 'model'):
            del self.model
        if hasattr(self, 'processor'):
            del self.processor
        if torch.cuda.is_available():
            torch.cuda.empty_cache()