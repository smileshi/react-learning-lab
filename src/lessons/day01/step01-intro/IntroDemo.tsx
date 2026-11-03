function Welcome() {
  return <h2>Welcome to React!</h2>;
}

function UserInfo() {
  return (
    <div>
      <p>Name: Tom</p>
      <p>Role: Developer</p>
    </div>
  );
}

function IntroDemo() {
  return (
    <div>
      <h1>React Component Demo</h1>

      <Welcome />

      <UserInfo />
    </div>
  );
}

export default IntroDemo;