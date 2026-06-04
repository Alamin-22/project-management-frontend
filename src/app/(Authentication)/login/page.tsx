import LoginForm from "@/components/AuthenticationRelated/LoginForm";

export const metadata = {
  title: "Login | Smart Project Workspace",
};

const LoginPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-card p-8 shadow-lg border border-border">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Smart Workspace
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your staff credentials to access your projects and tasks.
          </p>
        </div>

        <LoginForm />

        <p className="text-center text-xs text-muted-foreground pt-4 border-t border-border">
          Authorized Access Only. All actions are audited.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
