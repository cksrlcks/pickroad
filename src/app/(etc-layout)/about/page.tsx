import Image from "next/image";
import Link from "next/link";
import Logo from "@/assets/img/logo.svg";
import LottieClap from "@/assets/img/lottie-clap.json";
import LottieRocket from "@/assets/img/lottie-rocket.json";
import LottieStar from "@/assets/img/lottie-star.json";
import LottieWand from "@/assets/img/lottie-wand.json";
import AboutSlogan from "@/components/AboutSlogan";
import LottieIcon from "@/components/LottieIcon";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function AboutPage() {
  return (
    <div className="break-keep">
      <AboutSlogan className="mb-20" />

      <section className="mb-20 w-[90%]">
        <h2 className="mb-8 text-lg font-semibold">
          <span className="roboto-serif">Pick Road</span> 는 이런 서비스예요
        </h2>
        <ul className="mb-10 space-y-1 font-medium">
          <li>링크 정리를 넘어서 누군가에게 방향을 제시하고 싶은 사람</li>
          <li>블로그 글 하나 쓰기엔 벅차지만 큐레이션은 하고 싶은 사람</li>
          <li>다른 사람의 추천보다 나만의 추천 리스트를 만들고 싶은 사람</li>
        </ul>
        <p className="text-muted-foreground">
          PickRoad는 단순한 링크 저장을 넘어서, 내가 정리한 정보로 누군가에게
          방향을 제시할 수 있는 큐레이션 서비스입니다. 블로그처럼 길게 쓰지
          않아도, 링크만 모아도 자연스럽게 흐름과 맥락이 생깁니다. 가볍게
          공유하고 싶지만, 나만의 관점은 담고 싶은 사람에게 잘 어울립니다.
          추천을 따라가기보다, 직접 큐레이션한 나만의 리스트를 만들고 싶은
          당신을 위한 공간입니다.
        </p>
      </section>
      <section>
        <ul className="grid w-[80%] grid-cols-1 gap-x-24 gap-y-20 md:w-full md:grid-cols-2">
          <li>
            <LottieIcon data={LottieWand} className="mb-8" />
            <h3 className="mb-2 font-semibold">로드맵 만들기</h3>
            <p className="text-muted-foreground">
              이미지를 넣으면 자동으로 색상을 추천해주고, 링크만 넣어도 예쁜
              프리뷰 카드가 완성돼요.
            </p>
          </li>
          <li>
            <LottieIcon data={LottieRocket} className="mb-8" />
            <h3 className="mb-2 font-semibold">간편한 공유</h3>
            <p className="text-muted-foreground">
              카카오톡 공유부터 링크 복사까지, 클릭 한 번으로 누구에게나 쉽게
              전달할 수 있어요.
            </p>
          </li>
          <li>
            <LottieIcon data={LottieStar} className="mb-8" />
            <h3 className="mb-2 font-semibold">즐겨찾기</h3>
            <p className="text-muted-foreground">
              좋아요와 즐겨찾기 기능으로 마음에 드는 로드맵을 저장하고 활동을
              기록해보세요.
            </p>
          </li>
          <li>
            <LottieIcon data={LottieClap} className="mb-8" />
            <h3 className="mb-2 font-semibold">영감 얻기</h3>
            <p className="text-muted-foreground">
              다른 사람의 로드맵을 보며 나만의 방향과 아이디어를 발견해보세요.
            </p>
          </li>
        </ul>
      </section>
      <Separator className="my-20" />
      <section className="mb-20">
        <div className="mb-8">
          <Image src={Logo} alt="PickRoad" className="dark:invert" />
        </div>
        <h3 className="mb-8 text-xl leading-tight font-semibold tracking-tight md:text-2xl">
          링크로 만들 수 있는 가장 간단한 로드맵
          <br />
          생각보다 더 많은 사람이 그 길을 따라올지도 몰라요
        </h3>
        <p className="text-muted-foreground mb-10">
          내가 모은 링크들, 그냥 흘려보내기엔 아깝잖아요.
          <br />
          PickRoad에 정리해보세요.
        </p>
        <Button type="button" asChild>
          <Link href="/">시작하기</Link>
        </Button>
      </section>
    </div>
  );
}
