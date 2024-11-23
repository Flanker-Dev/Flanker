import { toast } from "@/hooks/use-toast";

export const handleError = () => {
  toast({
    title: "Up to 100 characters :(",
    description: "You cannot create a file with more than 100 characters.",
    variant: "destructive",
  });
};

export const handleSuccess = () => {
  toast({
    title: "Success!",
    description: "File created successfully.",
    variant: "default",
  });
};
