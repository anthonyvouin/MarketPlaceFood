"use client";  

import RegisterForm from "./registerForm";

export default function SignUp({ onSubmit }: { onSubmit: (formData: FormData) => Promise<void> }) {
    return (
        <div>
            <RegisterForm onSubmit={onSubmit} /> 
        </div>
    );
}
