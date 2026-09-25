# L'AMOUR API — container image for any Docker host (Railway, Render, Fly.io…).
# Mount a persistent volume at /data: it holds the SQLite database and the uploaded photos.
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY LAmour.Api/LAmour.Api.csproj LAmour.Api/
RUN dotnet restore LAmour.Api/LAmour.Api.csproj
COPY LAmour.Api/ LAmour.Api/
RUN dotnet publish LAmour.Api/LAmour.Api.csproj -c Release -o /app --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app .
ENV ASPNETCORE_ENVIRONMENT=Production \
    ASPNETCORE_HTTP_PORTS=8080 \
    ConnectionStrings__Default="Data Source=/data/lamour.db" \
    Storage__UploadsPath=/data/uploads
# Required at deploy time (set them in the host's dashboard, never in this file):
#   Jwt__Key                 long random secret
#   SeedAdmin__Password      first admin password (only used when the database is new)
#   Cors__AllowedOrigins__0  https://your-site.vercel.app
EXPOSE 8080
ENTRYPOINT ["dotnet", "LAmour.Api.dll"]
