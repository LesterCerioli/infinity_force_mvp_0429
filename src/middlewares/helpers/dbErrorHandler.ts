// Error handler utility
const uniqueMessage = (e: Error): string => {
    let message: string;
    try {
      const matched = e.message.substring(
        e.message.lastIndexOf(".$") + 2,
        e.message.lastIndexOf("_1")
      );
      message = matched.charAt(0).toUpperCase() + matched.slice(1) + " already exists";
    } catch (err) {
      message = "Unique field already exists";
    }
    return message;
  };
  
  interface MongooseError {
    code?: number;
    message: string;
    errors?: Record<string, { message: string }>;
  }
  
  
  export const errorHandler = (e: MongooseError): string => {
    let errorMessage = "";
  
    if (e.code) {
      switch (e.code) {
        case 11000:
        case 11001:
          errorMessage = uniqueMessage(e);
          break;
        default:
          break;
      }
    }
  
    if (!errorMessage && e.message.includes("Cast to ObjectId failed")) {
      errorMessage = "No data found";
    }
  
    if (!errorMessage && e.errors) {
      for (let field in e.errors) {
        if (e.errors[field].message) {
          errorMessage = e.errors[field].message;
        }
      }
    }
  
    if (errorMessage.includes("Path")) {
      errorMessage = errorMessage.slice(6); // Remove "Path "
    }
  
    return errorMessage;
  };
  