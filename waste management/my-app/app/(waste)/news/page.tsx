import NewsList from "@/components/ui/news/NewList"


const Newspage = () => {
  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold mb-8">Latest News</h2>
      <NewsList/>
    </section>
  )
}

export default Newspage