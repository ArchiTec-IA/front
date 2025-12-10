export async function AuthServices(formData: FormData) {
  const mockEmail = import.meta.env.VITE_USER_EMAIL;
  const mockPassword = import.meta.env.VITE_USER_PASSWORD;

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  console.log(email, password);

  if (email === mockEmail && password === mockPassword) {
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem(
      "user",
      JSON.stringify({
        name: import.meta.env.VITE_USER_NAME,
        email: import.meta.env.VITE_USER_EMAIL,
      })
    );
    return { success: true };
  } else {
    return { success: false, message: "Credenciais inválidas" };
  }
}
