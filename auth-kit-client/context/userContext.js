import React, { createContext, useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { setUncaughtExceptionCaptureCallback } from 'process';

const UserContext = createContext();

export const UserContextProvider = ({children}) => {

    const serverUrl = "http://localhost:8000";
    const router = useRouter();
    const [user, setUser] = useState({});
    const [userState, setUserState] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    //register user

    const registerUser = async(e) => {
        console.log("ghusa")
        console.log("Data being sent:", userState);
        e.preventDefault();
        if(!userState.email.includes("@") || !userState.password || userState.password.length < 6){
            toast.error("Please enter a valid email and password (min 6 characters)")
            console.log("nikla")
            console.log(userState)
            return;
        }
        try {
            const res = await axios.post(`${serverUrl}/api/v1/register`, userState);
            console.log("User reg done", res.data);
            toast.success("User registered successfully");
            setUserState({
                name: "",
                email: "",
                password: "",
            });
            //redirect to login
            router.push("/login");

        } catch (error) {
            console.log("Error registering user", error);
            toast.error(error.response.data.message);

        }
    };

    const loginUser = async (e) => {
        e.preventDefault();
        try {
          const res = await axios.post(
            `${serverUrl}/api/v1/login`,
            {
              email: userState.email,
              password: userState.password,
            },
            {
              withCredentials: true, // send cookies to the server
            }
          );
    
          toast.success("User logged in successfully");
    
          // clear the form
          setUserState({
            email: "",
            password: "",
          });
    
          // refresh the user details
          await getUser(); // fetch before redirecting
    
          // push user to the dashboard page
          router.push("/");
        } catch (error) {
          console.log("Error logging in user", error);
          toast.error(error.response.data.message);
        }
      };

    //get user logged in status
    const userLoginStatus = async(e) => {
        let loggedIn = false;
        try {
            const res = await axios.get(`${serverUrl}/api/v1/login-status`, {
                withCredentials: true,
            });
            loggedIn = !!res.data;
            setLoading(false);

            if(!loggedIn){
                router.push("/login")
            }

        } catch (error) {
            console.log("error getting login status", error);
        }
        console.log("User logged in status", loggedIn);
        return loggedIn;
    };

    const logoutUser = async() => {
        try {
            const res = await axios.get(`${serverUrl}/api/v1/logout`, {
                withCredentials: true,
            });

            toast.success("User logged out successfully");

            router.push("/login");

        } catch (error) {   
            console.log("Error logging user out ", error)
        }
    }

    //get user details
    const getUser = async () => {
        
        setLoading(true);
        try {
            const res = await axios.get(`${serverUrl}/api/v1/user`, {
                withCredentials: true,
            });

            setUser((prevState) => {
                return{
                    ...prevState,
                    ...res.data,
                }
            });

            setLoading(false);
        } catch (error) {
            console.log("error getting user details", error);
            setLoading(false);
            toast.error(error.response.data.message);
        }
    }

    const updateUser = async (e, data) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.patch(`${serverUrl}/api/v1/user`, data, {
                withCredentials:true,
            });

            setUser((prevState) => {
                return {
                    ...prevState,
                    ...res.data,
                };
            });

            toast.success("User details updated successfully")

            setLoading(false);
        } catch (error) {
            console.log("error updating user details",error);
            setLoading(false);
            toast.error(error.response.data.message);
        }
    };

    //dynamic form handler
    const handlerUserInput =(name)=> (e)=> {
        const value = e.target.value;
        setUserState((prevState)=> ({
            ...prevState,
            [name]: value
        }))
    };

    useEffect(()=> {
        const loginStatusGetUser = async () => {
            const isLoggedIn = await userLoginStatus();
            console.log("tempting")
            if(isLoggedIn){
                getUser();
            }
        };
        loginStatusGetUser();
    }, [])

    return (
        <UserContext.Provider value={{
            registerUser,
            userState,
            handlerUserInput,
            loginUser,
            logoutUser,
            userLoginStatus,
            user,
            updateUser,
            
            }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUserContext = () => {
    return useContext(UserContext);
};

