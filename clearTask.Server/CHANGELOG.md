This file explains how Visual Studio created the project.

The following steps were used to generate this project:
- Create new ASP\.NET Core Web API project.
- Update `launchSettings.json` to register the SPA proxy as a startup assembly.
- Update project file to add a reference to the frontend project and set SPA properties.
- Add project to the startup projects list.
- Write this file.


Add-Migration MigrationName
Update-Database

//in cd cleartask.server
dotnet add package Microsoft.AspNetCore.Identity.EntityFrameworkCore
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package Microsoft.EntityFrameworkCore.SqlServer



//cd cleartask.client
npm install react-router-dom

dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL


//for migration
dotnet ef migrations add AddtaskSetup
dotnet ef database update


