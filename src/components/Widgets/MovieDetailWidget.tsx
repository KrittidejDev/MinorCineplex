import Tag from '../Widgets/Tag'
import { Button } from '../ui/button'
import Image from 'next/image'

interface MovieDetailProps {
  title: string
  image: string
  date: string
  detail: string
}

function MoviesDetailWidget({ title, image, date, detail }: MovieDetailProps) {
  return (
    <>
      <div className="w-screen flex justify-start lg:justify-center lg:mt-[60px]">
        <div className="w-full lg:w-[1200px] lg:h-[600px] flex flex-col lg:flex-row">
          <div className="relative w-full h-64 lg:w-[411px] lg:h-[600px]">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover rounded-md"
            />
          </div>

          <div className="flex flex-col flex-1 py-10 px-4 lg:p-[60px] bg-gray-gc1b/70 backdrop-blur-xl rounded-md">
            <div className="flex flex-col gap-4">
              <h2 className="text-f-36 text-white-wfff">{title}</h2>
              <div className="w-fit flex flex-col lg:flex-row lg:items-center">
                <div className="flex gap-2 border-r border-gray-gedd pr-2 lg:pr-5">
                  <Tag name="Action" variant="genre" />
                  <Tag name="Crime" variant="genre" />
                  <Tag name="TH" variant="language" />
                </div>
                <p className="text-fr-16 text-gray-gedd mt-2 lg:mt-0 lg:pl-5">
                  Release date: {date}
                </p>
              </div>
            </div>
            <div className="mt-6 mb-10 lg:my-12">
              <Button className="btn-base blue-normal">Movie detail</Button>
            </div>
            <p className="text-fr-16 text-gray-gedd">{detail}</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default MoviesDetailWidget
