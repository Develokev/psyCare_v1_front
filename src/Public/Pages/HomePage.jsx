
export const HomePage = () => {

  const handleSubmit = (ev) => {
    ev.preventDefault();

  };

  return (
    <>
    <header>
        Esto es Header NEW
    </header>

    <body>
        <div>
          <h1>PSYCARE HOME</h1>
            <h2>log in</h2>
              <form onSubmit= {handleSubmit}>
                <div>
                <input type="email" id="email" name="email" required />
                </div>
                <div>
                  <input type="password" name="password" id="password" required />
                </div>
                <button type="submit">Log In</button>
              </form>
        </div>
    </body>

    </>
  )
}
