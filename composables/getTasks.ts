export const useGetTasks = () => {
  
  const tasks= ref([])

  const getTasks = async () => {
    try {

    const response:any = await $fetch('/api/tasks')
    tasks.value = response.data

    } catch (error) {
      console.log("Error fetching tasks", error)
    }
  }


}
