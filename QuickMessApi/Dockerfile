FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 5123

ENV PORT=5123

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["QuickMess.Api/QuickMess.Api.csproj", "QuickMess.Api/"]
COPY ["QuickMess.Business/QuickMess.Business.csproj", "QuickMess.Business/"]
RUN dotnet restore "QuickMess.Api/QuickMess.Api.csproj"

COPY . .
WORKDIR "/src/QuickMess.Api"
RUN dotnet build "QuickMess.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "QuickMess.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
# ENTRYPOINT ["dotnet", "IQTestApi.dll"]
CMD ASPNETCORE_ENVIRONMENT=Development ASPNETCORE_URLS=http://*:$PORT "dotnet" "QuickMess.Api.dll"