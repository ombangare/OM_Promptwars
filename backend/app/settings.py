from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_env: str = 'development'
    cors_origins: str = 'http://localhost:5173'
    supabase_url: str | None = None
    supabase_publishable_key: str | None = None
    gemini_api_key: str | None = None
    gemini_model: str = 'gemini-3.8-flash'

    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8', extra='ignore')

    @property
    def cors_origin_list(self) -> list[str]:
        return [x.strip() for x in self.cors_origins.split(',') if x.strip()]

settings = Settings()
