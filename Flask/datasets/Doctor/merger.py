import pandas as pd

# Define input files
csv_file_1 = r"c:\Users\rupal\Documents\Aarogya\Flask\datasets\Doctor\Doctor.csv"
csv_file_2 = r"c:\Users\rupal\Documents\Aarogya\Flask\datasets\Doctor\Doctor1.csv"

# Read both CSVs
df1 = pd.read_csv(csv_file_1)
df2 = pd.read_csv(csv_file_2)

# Merge both
merged_df = pd.concat([df1, df2], ignore_index=True)

# Drop duplicates
merged_unique_df = merged_df.drop_duplicates()

# Define output path
output_file = r"c:\Users\rupal\Documents\Aarogya\Flask\datasets\Doctor\Merged_Doctor.csv"

# Save merged data
merged_unique_df.to_csv(output_file, index=False)

print(f"Merged CSV saved to {output_file} with {len(merged_unique_df)} unique rows.")
