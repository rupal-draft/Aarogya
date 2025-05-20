// Format date to readable string
export const formatDate = (dateString: string): string => {
    if (!dateString) return ""

    const date = new Date(dateString)

    // Check if date is valid
    if (isNaN(date.getTime())) return ""

    // Format options
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    }

    return date.toLocaleDateString("en-US", options)
  }

  // Get relative time (e.g., "2 days ago")
  export const getRelativeTime = (dateString: string): string => {
    if (!dateString) return ""

    const date = new Date(dateString)

    // Check if date is valid
    if (isNaN(date.getTime())) return ""

    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    // Less than a minute
    if (diffInSeconds < 60) {
      return "just now"
    }

    // Less than an hour
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
    }

    // Less than a day
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} hour${hours > 1 ? "s" : ""} ago`
    }

    // Less than a week
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} day${days > 1 ? "s" : ""} ago`
    }

    // Less than a month
    if (diffInSeconds < 2592000) {
      const weeks = Math.floor(diffInSeconds / 604800)
      return `${weeks} week${weeks > 1 ? "s" : ""} ago`
    }

    // Less than a year
    if (diffInSeconds < 31536000) {
      const months = Math.floor(diffInSeconds / 2592000)
      return `${months} month${months > 1 ? "s" : ""} ago`
    }

    // More than a year
    const years = Math.floor(diffInSeconds / 31536000)
    return `${years} year${years > 1 ? "s" : ""} ago`
  }
