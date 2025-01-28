FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5076

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["clearTask.Server.csproj", "./"]
RUN dotnet restore "./clearTask.Server.csproj"
COPY . .
RUN dotnet build "clearTask.Server.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "clearTask.Server.csproj" -c Release -o /app/publish



FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "clearTask.Server.dll"]