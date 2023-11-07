import React, { useEffect, useState } from "react";
import AuthService from "../../utils/auth";

export default function Profile() {
  const [userName, setUserName] = useState();

  useEffect(() => {
    if (AuthService.loggedIn()) {
      const profile = AuthService.getProfile();
      const firstName = profile.data.firstName;
      const lastName = profile.data.lastName;
      setUserName(`${firstName} ${lastName}`);
    }
  }, []);

  return <h1>{userName}'s Profile</h1>;
}
