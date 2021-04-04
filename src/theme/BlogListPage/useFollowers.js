import { useEffect, useState } from "react";

export default function useFollowers() {
  const [followers, setFollowers] = useState(0);
  const getFollowers = async () => {
    try {
      const res = await fetch("https://api.7b80qm1n.cn/followers");
      const followers = await res.json();
      setFollowers(followers.followers);
    } catch (error) {}
  };

  useEffect(() => {
    getFollowers();
  }, []);

  return followers;
}
