

export default function ProtectedDashboard({ setUser, authUser}) {
  //props passed from Navbar

  // const user = authUser
  // console.log(user);
  return (
      authUser ? ( <a className="navbar-item" href="/dashboard">
      Dashboard
    </a>) : null  
  )
}
