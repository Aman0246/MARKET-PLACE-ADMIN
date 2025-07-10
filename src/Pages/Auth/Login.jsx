import React, { useState } from "react";
import Button from "../../Component/Atoms/Button/Button";
import Input from "../../Component/Atoms/InputFields/Inputfield";
import Image from "../../Component/Atoms/Image/Image";
import useToast from "../../Component/ToastProvider/useToast";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../../contexts/theme/hook/useTheme";
import { login } from "../../features/slices/userSlice";
import { useNavigate } from "react-router";

export default function Login() {
  const { theme } = useTheme();
  const toast = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.user);
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!form.email) newErrors.email = "Email is required";
    if (!form.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    dispatch(login({ email: form.email, password: form.password }))
      .then((result) => {
        if (login.fulfilled.match(result)) {
          toast("Login successful");
          navigate('/dashboard')
        } else {
          toast(result.payload || "Login failed");
        }
      })
      .catch((err) => {
        toast("Something went wrong");
        console.error(err);
      })
      .finally(() => { });
  };

  let { loading, error } = selector ? selector : {};
  console.log("error", error);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: theme.colors.background }}
    >
      <div
        className="w-full max-w-md p-8 rounded-xl shadow-lg"
        style={{
          backgroundColor: theme.colors.card,
          color: theme.colors.textPrimary,
          borderRadius: theme.borderRadius.lg,
          border: `1px solid ${theme.colors.borderLight}`,
        }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            error={errors.email}
            fullWidth
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            error={errors.password}
            fullWidth
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            loaderText="Signing in..."
            className="w-full"
          >
            Login
          </Button>
        </form>

        <p
          className="mt-4 text-sm text-center"
          style={{ color: theme.colors.textSecondary }}
        >
          Don't have an account?{" "}
          <a
            href="/register"
            className="font-medium hover:underline"
            style={{ color: theme.colors.textSecondary }}
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
