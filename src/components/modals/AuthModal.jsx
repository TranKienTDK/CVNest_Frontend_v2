import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/routes/routes";
import { LockIcon, UserPlusIcon } from "lucide-react";

const AuthModal = ({ open, onOpenChange, title, description }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate(ROUTES.LOGIN);
  };

  const handleRegister = () => {
    navigate(ROUTES.REGISTER);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>      <DialogContent className="sm:max-w-sm border-0 shadow-lg rounded-xl bg-gradient-to-br from-white to-gray-50">
        <DialogHeader className="pb-3 border-b border-gray-100">
          <DialogTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <LockIcon className="h-5 w-5 text-primaryRed" />
            {title || "Xác thực người dùng"}
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2 text-sm">
            {description || "Bạn cần đăng nhập để sử dụng tính năng này."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-3 text-center">
          <p className="text-sm text-gray-500 mb-2">Vui lòng chọn phương thức xác thực:</p>
          <div className="flex flex-row space-x-3 mt-3">
            <Button
              type="button"
              onClick={handleRegister}
              variant="outline"
              className="flex-1 py-2 bg-white border-2 border-primaryRed text-primaryRed hover:bg-primaryRed/10 font-medium transition-all duration-200 transform hover:scale-[1.02] hover:shadow-md"
            >
              <UserPlusIcon className="mr-1 h-4 w-4" />
              Đăng ký
            </Button>
            
            <Button
              type="button"
              onClick={handleLogin}
              className="flex-1 py-2 bg-primaryRed hover:bg-primaryRed/90 text-white font-medium transition-all duration-200 transform hover:scale-[1.02] hover:shadow-md"
            >
              <LockIcon className="mr-1 h-4 w-4" />
              Đăng nhập
            </Button>
          </div>
        </div>
          <DialogFooter className="flex flex-col justify-center items-center pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            CVNest - Giải pháp tuyển dụng hiệu quả
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
