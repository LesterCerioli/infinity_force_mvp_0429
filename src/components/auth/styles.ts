export const authStyles = {
    
    container: "flex flex-col items-center justify-center p-6",
    formContainer: "w-full max-w-md space-y-4 mt-4 px-4",
        
    title: "text-xl font-medium text-white",
        
    walletGrid: "mt-6 grid grid-cols-2 gap-3 px-4 w-full",
    walletButton: "flex items-center justify-center gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
    metaMaskButton: "col-span-2", // Extends walletButton
        
    input: "w-full p-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition",
    errorText: "text-sm text-red-600 dark:text-red-400",
        
    primaryButton: "w-full mt-3 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition",
    secondaryButton: "w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:underline focus:outline-none",
        
    downloadText: "mt-4 px-4 text-xs text-gray-500 dark:text-gray-400",
    downloadLink: "cursor-pointer text-blue-600 dark:text-blue-400 hover:underline",
        
    toggleAuth: "mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
  } as const;
    
  export type AuthStyles = typeof authStyles;