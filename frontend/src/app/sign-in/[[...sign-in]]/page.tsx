import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-4">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-black text-[#121212] tracking-tight">
          PATHFINDER <span className="text-[#736E65] font-light">AI</span>
        </h1>
        <p className="text-xs text-[#736E65] mt-1 font-medium">
          Talent Has No Location. Opportunity Shouldn&apos;t Either.
        </p>
      </div>
      <SignIn
        fallbackRedirectUrl="/"
        forceRedirectUrl="/"
        appearance={{
          elements: {
            card: "bg-white border border-[#E2DBD0] rounded-3xl shadow-xl",
            headerTitle: "text-[#121212] font-black",
            headerSubtitle: "text-[#736E65] text-xs",
            formButtonPrimary: "bg-[#121212] hover:bg-[#262626] text-white text-xs font-bold rounded-xl",
            formFieldInput: "rounded-xl border-[#E2DBD0] text-xs text-[#121212] focus:border-[#121212]",
            footerActionLink: "text-[#121212] font-bold hover:underline",
          },
        }}
      />
    </div>
  );
}

