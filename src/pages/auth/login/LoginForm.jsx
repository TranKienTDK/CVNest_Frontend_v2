import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

const LoginForm = ({ onSubmit }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    let newErrors = {};
    if (!form.email.includes("@")) newErrors.email = "Email không hợp lệ";
    if (form.password.length < 8)
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});    try {
      if (onSubmit) {
        await onSubmit(form.email, form.password);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        navigate("/dashboard");
      }    } catch (error) {
      toast.error("Email hoặc mật khẩu không chính xác. Vui lòng thử lại", {
        position: "top-right",
        autoClose: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Card className="w-full max-w-md bg-white shadow-xl border-none rounded-xl overflow-hidden ring-1 ring-primary/10">
      <CardHeader className="space-y-1 bg-gradient-to-r from-[#205781] to-[#4F959D] pb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Đăng nhập
          </h2>
          <p className="text-sm text-white mt-2">
            Đăng nhập để tiếp tục khám phá cơ hội nghề nghiệp!
          </p>
        </motion.div>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-[#205781]">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-[#98D2C0]" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={handleChange}
                className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                autoComplete="email"
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

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password" className="text-sm font-medium text-[#205781]">
                Mật khẩu
              </Label>
              <a
                href="/forgot-password"
                className="text-xs text-[#4F959D] hover:text-[#4F959D]/80 hover:underline transition-colors"
              >
                Quên mật khẩu?
              </a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-[#98D2C0]" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className={`pl-10 ${errors.password ? "border-destructive" : ""}`}
                autoComplete="current-password"
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
            )}          </div>

          <Button
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
              "Đăng nhập"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t p-6">
        <p className="text-sm text-muted-foreground">
          Chưa có tài khoản?{" "}
          <a
            href="/register"
            className="text-[#205781] hover:text-[#205781]/80 hover:underline font-medium transition-colors"
          >
            Đăng ký ngay
          </a>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
