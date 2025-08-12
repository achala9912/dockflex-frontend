"use client";

import { useLoaderStore } from "@/store/useLoaderStore";
import { Discuss } from "react-loader-spinner";

type Props = {
  text?: string;
  size?: number;
};

const Loader = ({ text, size = 100 }: Props) => {
  const { loading } = useLoaderStore();

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center mx-auto ">
        <div className="flex items-center">
          <Discuss
            visible={true}
            height={size}
            width={size}
            colors={["#b8d3f5", "#f0f0f0"]}
            ariaLabel="discuss-loading"
            wrapperStyle={{}}
            wrapperClass="discuss-wrapper"
          />
        </div>
        {text && <span className="-mt-2 text-center text-white">{text}</span>}
      </div>
    </div>
  );
};

export default Loader;
