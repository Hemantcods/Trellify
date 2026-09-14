import { zodResolver } from "@hookform/resolvers/zod";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { SigninSchema, type SigninInput } from "shared";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authApi } from "../auth.api";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { API_URL } from "@/lib/api";
import { useAuth } from "../AuthContext";
export const SigninPage = () => {
  const [searchParams] = useSearchParams();
  // redirect address
  const redirect = searchParams.get("redirect") || "/dashboard";
  const googlePopupRef = useRef<Window | null>(null);
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const form = useForm<SigninInput>({
    resolver: zodResolver(SigninSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (data: SigninInput) => {
    try {
      console.log("button clicked");
      await authApi.signin(data);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };
  const handleGoogleLogin = async () => {
    console.log("handle google login")
    const width = 500;
    const height = 600;

    const left = window.screenX + (window.outerWidth - width) / 2;

    const top = window.screenY + (window.outerHeight - height) / 2;
    const popup = window.open(
      `${API_URL}/auth/google`,
      "google-oauth",
      `
          width=${width},
          height=${height},
          left=${left},
          top=${top}
        `,
    );
    googlePopupRef.current = popup;
  };
  // Recive message form Oauth popup
  useEffect(() => {
    const handleOoutMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        return;
      }
      if (event.data?.type !== "GOOGLE_AUTH_SUCCESS") {
        return;
      }
      try {
        await refreshUser();
        navigate(redirect, {
          replace: true,
        });
      } catch (error) {
        console.error("Failed to refresh user after Google login", error);
      }
    };
    window.addEventListener("message", handleOoutMessage);
    return () => {
      window.removeEventListener("message", handleOoutMessage);
    };
  }, [navigate, redirect, refreshUser]);
  useEffect(() => {
    if (user) {
      navigate(redirect, {
        replace: true,
      });
    }
  }, [user, redirect, navigate]);
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Signin to your Account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="**********"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                color="blue"
                type="submit"
                className="w-full rounded-full bg-black text-white"
                disabled={form.formState.isSubmitting}
                variant="outline"
              >
                {form.formState.isSubmitting ? "Singning In..." : "Sign In"}
              </Button>
            </form>
          </Form>
          <Button
            type="button"
            variant="outline"
            className="w-full mt-10"
            onClick={handleGoogleLogin}
          >
            <FcGoogle className="size-5" />
            Continue with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
