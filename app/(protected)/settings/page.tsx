import { auth } from "@/auth"



const Settingpage = async () => {
    const session = await auth();
  return (
    <div>
        {JSON.stringify(session)}
    </div>
  )
}

export default Settingpage