import React, { useState } from "react";
import { AiOutlineTwitter } from "react-icons/ai";
import { BiLogoFacebook } from "react-icons/bi";
import { Api } from "../../Api";
import { Spinner, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [loginLoading, setLoginLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  async function HandleLogin(e) {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;
    console.log(email, password);
    try {
      setLoginLoading(true);
      const response = await fetch(`${Api}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Login Failed");
      }

      const data = await response.json();
      console.log(data);
      localStorage.setItem("login", JSON.stringify(data));
      navigate("/");
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Check email and password",
        duration: 2000,
        status: "error",
      });
    } finally {
      setLoginLoading(false);
    }
  }

  return (
    <section className="h-screen flex flex-col md:flex-row justify-center space-y-10 md:space-y-0 md:space-x-16 items-center my-2 mx-5 md:mx-0 md:my-0">
      <div className="md:w-1/3 max-w-sm">
        <img
          src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
          alt="Sample image"
        />
      </div>
      <form onSubmit={HandleLogin} className="md:w-1/3 max-w-sm">
        <div className="my-5 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
          <p className="mx-4 mb-0  text-xl text-center font-semibold text-slate-500">
            Login
          </p>
        </div>
        <input
          className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded"
          type="email"
          name="email"
          required
          placeholder="Email Address"
        />
        <input
          className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4"
          type="password"
          name="password"
          required
          placeholder="Password"
        />

        <div className="text-center md:text-left">
          <button
            disabled={loginLoading && true}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white uppercase rounded text-xs tracking-wider"
            type="submit"
          >
            {loginLoading ? (
              <div className="flex gap-3  transition-all justify-center items-center">
                <Spinner />
                Loading
              </div>
            ) : (
              "Login"
            )}
          </button>
        </div>
        <div className="mt-4 font-semibold text-sm text-slate-500 text-center md:text-left">
          Don&apos;t have an account?{" "}
          <span
            onClick={() => navigate("/Register")}
            className="text-red-600 hover:underline hover:underline-offset-4"
          >
            Register
          </span>
        </div>
      </form>
    </section>
  );
};

export default Login;
