import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, KeyRound, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const RegisterForm = ({ onSubmit, logo }) => {  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    let newErrors = {};
    if (!form.username.trim())
      newErrors.username = "Tên người dùng không được để trống";
    if (!form.email.includes("@")) newErrors.email = "Email không hợp lệ";
    if (form.password.length < 8)
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Mật khẩu nhập lại không khớp";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setIsLoading(true);
        const data = {
          username: form.username,
          email: form.email,
          password: form.password,
        };
        
        if (onSubmit) {
          await onSubmit(data);
        }
      } catch (error) {
        setErrors({ api: error.message || "Đăng ký thất bại" });
      } finally {
        setIsLoading(false);
      }
    }
  };
  return (
    <Card className="w-full max-w-md bg-white shadow-xl border-none rounded-xl overflow-hidden ring-1 ring-primary/10">
      <CardHeader className="space-y-1 bg-gradient-to-r from-[#205781] to-[#4F959D] pb-6">
        <div className="flex items-center justify-center gap-2 mb-2 lg:hidden">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 150 }}
          >
            <CardTitle className="text-2xl font-bold text-white">
              CVNest
            </CardTitle>
          </motion.div>
          <motion.img
            initial={{ opacity: 0, rotate: -10 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            src={logo}
            alt="CVNest Logo"
            className="w-10 h-10 object-contain rounded-full bg-white/90 p-1"
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <CardTitle className="text-2xl font-semibold text-white">
            Đăng ký
          </CardTitle>
          <CardDescription className="text-white/80 mt-1">
            Tạo tài khoản miễn phí ngay hôm nay!
          </CardDescription>
        </motion.div>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">            <div className="flex items-center">
              <Label htmlFor="username" className="text-sm font-medium text-[#205781]">
                Tên người dùng
              </Label>
              {errors.username && (
                <span className="text-red-500 text-xs ml-auto">
                  {errors.username}
                </span>
              )}
            </div>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-5 w-5 text-[#98D2C0]" />
              <Input
                id="username"
                name="username"
                value={form.username}
                onChange={handleChange}
                className={`pl-10 ${errors.username ? "border-destructive" : ""}`}
                placeholder="Nhập tên người dùng"
              />
            </div>
            {errors.username && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-medium text-destructive"
              >
                {errors.username}
              </motion.p>
            )}
          </div>

          <div className="space-y-2">            <div className="flex items-center">
              <Label htmlFor="email" className="text-sm font-medium text-[#205781]">
                Email
              </Label>
              {errors.email && (
                <span className="text-red-500 text-xs ml-auto">
                  {errors.email}
                </span>
              )}
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-[#98D2C0]" />
              <Input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                placeholder="example@email.com"
              />
            </div>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-medium text-destructive"
              >
                {errors.email}
              </motion.p>
            )}
          </div>

          <div className="space-y-2">            <div className="flex items-center">
              <Label htmlFor="password" className="text-sm font-medium text-[#205781]">
                Mật khẩu
              </Label>
              {errors.password && (
                <span className="text-red-500 text-xs ml-auto">
                  {errors.password}
                </span>
              )}
            </div>            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-[#98D2C0]" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                className={`pl-10 ${errors.password ? "border-destructive" : ""}`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-2.5 text-[#98D2C0] hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-medium text-destructive"
              >
                {errors.password}
              </motion.p>
            )}
          </div>

          <div className="space-y-2">            <div className="flex items-center">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-[#205781]"
              >
                Xác nhận mật khẩu
              </Label>
              {errors.confirmPassword && (
                <span className="text-red-500 text-xs ml-auto">
                  {errors.confirmPassword}
                </span>
              )}
            </div>            <div className="relative">
              <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-[#98D2C0]" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className={`pl-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-3 top-2.5 text-[#98D2C0] hover:text-foreground transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-medium text-destructive"
              >
                {errors.confirmPassword}
              </motion.p>
            )}
          </div>          {errors.api && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 rounded-md bg-destructive/10 text-destructive text-sm"
            >
              {errors.api}
            </motion.div>
          )}          <Button
            type="submit"
            className="w-full bg-[#205781] hover:bg-[#205781]/90 text-white shadow-md hover:shadow-lg transition-all"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang xử lý...
              </>
            ) : (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                Đăng ký ngay
              </motion.span>
            )}
          </Button>
        </form>
      </CardContent>      <CardFooter className="flex justify-center border-t p-6">
        <p className="text-sm text-muted-foreground">
          Đã có tài khoản?{" "}
          <a
            href="/login"
            className="text-[#205781] hover:text-[#205781]/80 hover:underline font-medium transition-colors"
          >
            Đăng nhập ngay
          </a>
        </p>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
