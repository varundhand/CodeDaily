"use client"

import { useState,useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation" 

// import {useToaster} from "react-hot-toast"
import toast from "react-hot-toast"
// import DeleteModal from "@/components/DeleteModal" //TODO: Add better modal for the delete confirmation

import Profile from "@/components/Profile"

const MyProfile = () => {
  const {data: session} = useSession()
  const router = useRouter()

  const [posts, setPosts] = useState([]);

  // const [isDeleteModelOpen, setDeleteModelOpen] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`api/users/${session?.user.id}/posts`);
      const data = await response.json()
      // console.log(data);
      setPosts(data) 
      // setLoading(false)
    }

    if (session?.user.id)fetchPosts()
  }, [session?.user.id]) 

  // const fetchPosts = async () => {
  //   const response = await fetch(`/api/users/${session?.user.id}/posts`);
  //   const data = response.json()

  //   setPosts(data)
  // }

  const handleEdit = async (post) => {
    router.push(`/update-post?id=${post._id}`) //TODO: it pushes the route correctly but it doesnt render because it isnt configured correctly yet
  }

  const handleDelete = async (post) => {
    const hasConfirmed = confirm("Are you sure you want to delete this post?")
    // setDeleteModelOpen(true)

    if (hasConfirmed){
      try{
        await fetch(`/api/posts/${post._id.toString()}`, {
          method: 'DELETE'
        })
        const filteredPosts = posts.filter((p) => p._id !== post._id)
        setPosts(filteredPosts)
        console.log(filteredPosts)
        toast("Post deleted successfully.", {icon: '🗑️'})
        router.push('/')
      }catch(error){
        console.log(error)
      }
    }
  }

  return (
    <>
      <Profile
        name="My"
        desc="Welcome to your personalized profile page"
        data={posts}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      {/* {isDeleteModelOpen && (
        <DeleteModal onClose={() => setDeleteModelOpen(false)}/>
      )} */}
    </>
  )
}

export default MyProfile
