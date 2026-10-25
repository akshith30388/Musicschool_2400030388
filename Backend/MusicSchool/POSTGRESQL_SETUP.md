# PostgreSQL setup

Create the database once in PostgreSQL:

```sql
CREATE DATABASE music_school;
```

The backend connects to `localhost:5432/music_school` by default with username and password `postgres`.
Change those values without editing project files by setting these environment variables before starting the application:

```powershell
$env:DB_URL = "jdbc:postgresql://localhost:5432/music_school"
$env:DB_USERNAME = "postgres"
$env:DB_PASSWORD = "your-password"
```

Run the backend with `./mvnw.cmd spring-boot:run`. Hibernate creates or updates the `music_school` table automatically.
