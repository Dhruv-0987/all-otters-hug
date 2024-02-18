import CurrentUser from "./current-user"

const Header = () => {
  return (
    <div style={{display: 'flex', justifyItems: 'flex-end', alignItems: 'center', width: "100%"}}>
        <CurrentUser/>
    </div>
  )
}

export default Header
