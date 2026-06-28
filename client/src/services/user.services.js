import api from "../api/api";

export const FetchUser = async(id) => {
    const res = await api.get("/user/getuser",{params : {id}} );
    return res.data;
};

export const EditUser = async(formData) => {
    const res = await api.post("/user/edituser",{formData});
    return res.data;
}
