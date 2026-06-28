import api from "../api/api";

// ─── PLAYER AUTH ──────────────────────────────────────────────────────────────

export const SignupService = async (formData) => {
    const res = await api.post("/auth/signup", formData);
    return res.data;
};

export const LoginService = async (formData) => {
    const res = await api.post("/auth/login", formData);
    return res.data;
};

// ─── OWNER AUTH (separate collection) ────────────────────────────────────────

export const OwnerSignupService = async (formData) => {
    const res = await api.post("/owner-auth/signup", formData);
    return res.data;
};

export const OwnerLoginService = async (formData) => {
    const res = await api.post("/owner-auth/login", formData);
    return res.data;
};
