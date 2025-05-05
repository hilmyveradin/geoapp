export const getUserNameInitial = (name) => {
  if (name == null) {
    return;
  }
  const names = name?.split(" ");
  let initials = names[0]?.substring(0, 1).toUpperCase();
  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};

export const capitalizeFirstLetter = (string) => {
  if (!string) return string;
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

export const handleErrorMessage = (status) => {
  switch (status) {
    case 400:
      return {
        title: "Invalid Request",
        description: "Your request is incorrect or cannot be processed.",
      };
    case 401:
      return {
        title: "Unauthorized",
        description: "You need to log in to access this content.",
      };
    case 403:
      return {
        title: "Forbidden",
        description: "You don’t have permission to access this.",
      };
    case 404:
      return {
        title: "Not Found",
        description: "We couldn’t find what you were looking for.",
      };
    case 408:
      return {
        title: "Request Timeout",
        description: "Your request took too long. Please try again.",
      };
    case 422:
      return {
        title: "Unprocessable Entity",
        description: "We can’t process your request right now.",
      };
    case 500:
      return {
        title: "Internal Server Error",
        description: "Something went wrong on our end.",
      };
    case 502:
      return {
        title: "Bad Gateway",
        description: "There’s an error with our server. Please try later.",
      };
    case 503:
      return {
        title: "Service Unavailable",
        description:
          "We’re temporarily offline for maintenance. Please check back soon.",
      };
    case 504:
      return {
        title: "Gateway Timeout",
        description: "We couldn’t connect to the server. Please try again.",
      };
    default:
      return {
        title: "Error Occurred",
        description: "An unexpected error occurred. Please try again",
      };
  }
};
