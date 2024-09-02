import { ImageResponse } from "next/og"
import { appDescription, appName } from "@/lib/constants"
import Logo from "./logo"

export default async function OpengraphImage(
  props?: Readonly<{ title?: string }>
): Promise<ImageResponse> {
  const { title } = {
    ...{
      title: appName,
    },
    ...props,
  }

  return new ImageResponse(
    (
      <div tw="flex h-full w-full flex-col items-center justify-center bg-white">
        <div tw="flex flex-none items-center justify-center h-[160px] w-[160px]">
          <Logo width="84" height="84" />
        </div>
        <p tw="mt-12 text-6xl font-bold text-black">{title}</p>
        <p tw="mt-4 text-2xl text-gray-600">{appDescription}</p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
