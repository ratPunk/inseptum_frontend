import userDatarespose from "@/types/userDatarespose";

interface SuccessResponse {
  status: true;         
  message: string;
  data: userDatarespose;
}

interface ErrorResponse {
  status: false;         
  message: string;
}

// ✅ Named exports (correct for types/interfaces)
export type { SuccessResponse, ErrorResponse };