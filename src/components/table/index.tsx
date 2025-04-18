import { useState } from "react";

const LoginForm = () => {
    const [formData, setFormData] = useState({
      email: "",
      password: "",
    });
  
    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      console.log("Login data:", formData);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
    };

    const emailError = vali

