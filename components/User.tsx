import { useState, useEffect } from "react";
import axios, { AxiosResponse, AxiosError } from "axios";
import { useDispatch } from "react-redux";

import { setUsername } from "../redux";

type Props = {
  setModalMessage: (param: string) => void;
};

export default function User(props: Props) {
  const dispatch = useDispatch();
  const [userMode, setUserMode] = useState<"signIn" | "welcome" | "signUp">(
    "signIn"
  );
  const [usernameTemp, setUsernameTemp] = useState<string>("");

  useEffect(() => {
    axios
      .get("/api/user", {
        withCredentials: true,
      })
      .then((res: AxiosResponse) => {
        setUsernameTemp(res.data.username);
        setUserMode("welcome");
        dispatch(setUsername(res.data.username));
      })
      .catch((error: AxiosError) => console.error(error));
  }, [dispatch]);

  function signIn(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();

    const username: string = (
      document.querySelector(".user__signIn__username") as HTMLInputElement
    ).value.trim();
    const password: string = (
      document.querySelector(".user__signIn__password") as HTMLInputElement
    ).value.trim();

    if (username.length !== 0 && password.length !== 0)
      axios
        .post(
          "/api/signIn",
          {
            username,
            password,
          },
          { withCredentials: true }
        )
        .then((res: AxiosResponse): void => {
          setUsernameTemp(res.data.username);
          dispatch(setUsername(res.data.username));
          setUserMode("welcome");
        })
        .catch((error: AxiosError): void =>
          props.setModalMessage(error.message)
        );
    else props.setModalMessage("please fill all fields");
  }

  function signUp(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();

    const username: string = (
      document.querySelector(".user__signUp__username") as HTMLInputElement
    ).value.trim();
    const password: string = (
      document.querySelector(".user__signUp__password") as HTMLInputElement
    ).value.trim();
    const confirmPassword = (
      document.querySelector(
        ".user__signUp__confirmPassword"
      ) as HTMLInputElement
    ).value.trim();

    if (
      password === confirmPassword &&
      password.length !== 0 &&
      confirmPassword.length !== 0 &&
      username.length !== 0
    )
      axios
        .post("/api/signUp", { username, password }, { withCredentials: true })
        .then((res: AxiosResponse): void => {
          setUsernameTemp(res.data.username);
          dispatch(setUsername(res.data.username));
          setUserMode("welcome");
          props.setModalMessage(res.data.message);
        })
        .catch((error: AxiosError): void =>
          props.setModalMessage(error.message)
        );
    else if (
      password !== confirmPassword &&
      password.length !== 0 &&
      confirmPassword.length !== 0 &&
      username.length !== 0
    )
      props.setModalMessage("passwords do not match");
    else if (
      password.length === 0 ||
      confirmPassword.length === 0 ||
      username.length === 0
    )
      props.setModalMessage("please fill all fields");
  }

  function logOut(): void {
    axios
      .get("/api/logOut", {
        withCredentials: true,
      })
      .then((): void => {
        setUsernameTemp("");
        dispatch(setUsername(undefined));
        setUserMode("signIn");
      });
  }

  return (
    <div className={`user user--${userMode}`}>
      {(userMode === "signIn" || userMode === "signUp") && (
        <div className="user__buttons">
          <button
            onClick={() => setUserMode("signIn")}
            className={`user__buttons__button ${
              userMode === "signIn" ? "user__buttons__button--active" : ""
            }`}
          >
            SIGN IN
          </button>

          <button
            onClick={() => setUserMode("signUp")}
            className={`user__buttons__button ${
              userMode === "signUp" ? "user__buttons__button--active" : ""
            }`}
          >
            SIGN UP
          </button>
        </div>
      )}

      {userMode === "signIn" && (
        <form className="user__signIn" onSubmit={signIn}>
          <input
            className="user__signIn__username"
            type="text"
            name="name"
            placeholder="USERNAME"
            required
          />
          <input
            className="user__signIn__password"
            type="password"
            name="password"
            placeholder="PASSWORD"
            required
          />

          <button className="user__signIn__submit">SUBMIT</button>
        </form>
      )}

      {userMode === "signUp" && (
        <form className="user__signUp" onSubmit={signUp}>
          <input
            className="user__signUp__username"
            type="text"
            name="name"
            placeholder="USERNAME"
            required
          />
          <input
            className="user__signUp__password"
            type="password"
            name="password"
            placeholder="PASSWORD"
            required
          />
          <input
            className="user__signUp__confirmPassword"
            type="password"
            name="password"
            placeholder="CONFIRM PASSWORD"
            required
          />

          <button className="user__signUp__submit">SUBMIT</button>
        </form>
      )}

      {userMode === "welcome" && (
        <div className="user__welcome">
          <p className="user__welcome__username">{usernameTemp}</p>
          <button className="user__welcome__logOut" onClick={logOut}>
            LOG OUT
          </button>
        </div>
      )}
    </div>
  );
}
