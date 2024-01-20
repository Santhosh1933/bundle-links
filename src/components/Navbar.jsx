import React, { useContext, useEffect, useState } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button,
  Input,
} from "@chakra-ui/react";
import { IoMenu } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";

import { json, useNavigate } from "react-router-dom";
import { GlobalContext } from "./GlobalContext";

export const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navbarMenus = ["Dashboard"];
  const navigate = useNavigate();
  const btnRef = React.useRef();
  const [context, setContext] = useState("");
  useEffect(() => {
    var login = localStorage.getItem("login");
    if (login) {
      setContext(JSON.parse(login));
      console.log(login);
    }
  }, []);

  const { email } = context;
  console.log(email);
  return (
    <div className="sticky top-0">
      <div className="  py-6 border-b md:flex hidden justify-between px-[15%] items-center bg-white w-full">
        <div className="flex gap-8 items-center">
          <div onClick={() => navigate(`/`)}>Bundle Links 🔗</div>
          <nav className="flex cursor-pointer gap-4 text-sm text-gray-600">
            {navbarMenus.map((menu, i) => (
              <p key={i} onClick={() => navigate(`/${menu}`)}>
                {menu}
              </p>
            ))}
          </nav>
        </div>
        {!email ? (
          <div className="text-sm cursor-pointer flex items-center gap-6">
            <p onClick={() => navigate("/Login")}>Sign in</p>
            <p
              onClick={() => navigate("/Register")}
              className="px-5 py-2.5 bg-blue-600 text-white rounded"
            >
              Create Account
            </p>
          </div>
        ) : (
          <div className="flex justify-center items-center gap-4">
            <CgProfile size={30} />
            <p className="text-sm cursor-pointer flex items-center gap-6">
              {email}
            </p>
            <button
              onClick={() => {
                localStorage.removeItem("login");
                navigate("/login");
              }}
              className="py-2 px-3 bg-slate-100 border-2 rounded-lg"
            >
              Logout
            </button>
          </div>
        )}
      </div>
      <div>
        <div className="flex md:hidden  justify-between px-[5%] py-6 bg-white items-center">
          <div onClick={() => navigate(`/`)}>Bundle Links 🔗</div>
          <IoMenu size={30} onClick={onOpen} />
        </div>
        <Drawer
          isOpen={isOpen}
          placement="right"
          onClose={onClose}
          finalFocusRef={btnRef}
          size="full"
          className="md:hidden "
        >
          <DrawerOverlay />

          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>
              Bundle Links{" "}
              {email && (
                <>
                  <p className="text-sm text-gray-500 font-normal">{email}</p>
                </>
              )}
            </DrawerHeader>

            <DrawerBody className="flex flex-col gap-4 my-8">
              {navbarMenus.map((menu, i) => (
                <>
                  <p key={i} onClick={() => navigate(`/${menu}`)}>
                    {menu}
                  </p>
                  <hr />
                </>
              ))}
            </DrawerBody>

            {!email ? (
              <DrawerFooter className="w-full">
                <div className="text-sm w-full cursor-pointer flex justify-center items-center gap-1">
                  <p
                    onClick={() => navigate("/Login")}
                    className="px-5 w-2/4 py-2.5 bg-blue-50 border-2  rounded text-center"
                  >
                    Sign in
                  </p>
                  <p
                    onClick={() => navigate("/Register")}
                    className="px-5 w-full py-2.5 text-center bg-blue-600 border-2 border-blue-900 text-white rounded"
                  >
                    Create Account
                  </p>
                </div>
              </DrawerFooter>
            ) : (
              <button
                onClick={() => {
                  localStorage.removeItem("login");
                  navigate("/login");
                }}
                className="py-2 px-3 bg-slate-100 border-2 rounded-lg"
              >
                Logout
              </button>
            )}
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};
