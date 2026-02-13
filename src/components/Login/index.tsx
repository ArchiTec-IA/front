import { Quio, Solutions } from "@/assets/icons";
import logoBoaWhite from "@/assets/logo-boa-white.png";
import { useAppDispatch } from "@/hooks/hooks";
import { cn } from "@/lib/utils";
import { AuthServices } from "@/services/AuthServices";
import { setCredentials } from "@/store/authSlice";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

export function LoginPageComponent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const email = formData.get("email");

    console.log("Submitting form with data:", email);

    const result = await AuthServices(formData);

    if (result.success) {
      dispatch(
        setCredentials({
          user: {
            name: import.meta.env.VITE_USER_NAME as string,
            email: email as string,
          },
          isAuthenticated: true,
        }),
      );
      navigate("/splash", { replace: true });
    } else {
      toast.error(result.message);
    }
  };
  return (
    <div
      className={cn(
        "flex w-full items-center justify-center h-[100dvh] bg-[#1E1E1E]",
        className,
      )}
      {...props}
    >
      <div className="w-[40%] items-center justify-center flex flex-col gap-4">
        <Quio width={150} height={70} className="text-white" />
        <Solutions width={200} height={22} className="text-white" />
      </div>
      <div className="w-[50%] h-full flex items-center justify-center">
        <Card className="w-[60%] h-[70%] flex flex-col justify-center bg-white/15 border-none">
          <CardHeader className="">
            <div className="flex flex-col items-center">
              <CardTitle className="text-4xl text-white">
                <img
                  src={logoBoaWhite}
                  alt="Logo Quio"
                  className="h-36 w-auto object-contain" /* Ajusta h-12 conforme o tamanho desejado */
                />
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email" className="text-white">
                    Email
                  </FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="m@example.com"
                    required
                  />
                </Field>
                <Field>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="password" className="text-white">
                      Password
                    </FieldLabel>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    required
                  />
                </Field>
                <Field>
                  <Button
                    type="submit"
                    className="bg-black font-bold hover:bg-slate-950 hover:cursor-pointer text-accent-foreground"
                  >
                    Login
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
