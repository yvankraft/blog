interface BlogIDPagesProsps {
  params: {
    blogId: string;
  };
}
export default function page({ params }: BlogIDPagesProsps) {
  const { blogId } = params;

  return (
    <div>
      <h1 className="title">Blog ID: {blogId}</h1>
      <p>This is the blog post for ID: {blogId}</p>
    </div>
  );
}
