/* eslint-disable @next/next/no-img-element */
import { Carousel } from "antd";
import Link from "next/link";

const contentStyle: React.CSSProperties = {
  height: "100%",
  textAlign: "center",
};

const CarouselList = () => (
  <Carousel>
    <div>
      <div className="w-full relative" style={{ height: "500px" }}>
        <img
          style={{ width: "100%", height: "100%" }}
          src="/main_background_img.jpg"
          alt="배경이미지"
        />
        <div className="absolute top-0 text-center flex flex-col justify-center items-center w-full h-full">
          <h5 className="text-4xl text-white font-normal mb-3">
            ORIZIC에 연결
          </h5>
          <p className="text-lg text-white">
            놀라운 새로운 음악을 발견하고 이를 만드는
          </p>
          <p className="text-lg text-white">아티스트를 직접 지원하세요 .</p>
          <div className="cursor-pointer mt-6">
            <button className="w-32 px-2 h-12 text-center text-gray-400 font-normal border-gray-300 hover:border-blue-500 hover:text-blue-500 transition rounded-3xl border bg-white">
              <Link href={`/create`} legacyBehavior>
                <a className="flex justify-center items-center w-full h-full text-lg  text-black">
                  무료가입
                </a>
              </Link>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div className="w-full" style={{ height: "500px" }}>
        <img
          style={{ width: "100%", height: "100%" }}
          src="/main_background_img2.jpg"
          alt="배경이미지2"
        />
      </div>
    </div>
  </Carousel>
);

export default CarouselList;
