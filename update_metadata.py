import re
import sys

files = {
    "src/app/[locale]/(main)/rated-movies/page.tsx": "ratings",
    "src/app/[locale]/(main)/genres/page.tsx": "genres",
    "src/app/[locale]/(main)/genres/[type]/[genreId]/page.tsx": "genres",
    "src/app/[locale]/(main)/people/popular/page.tsx": "popular",
    "src/app/[locale]/(main)/tv/popular/page.tsx": "popular",
    "src/app/[locale]/(main)/tv/airing-today/page.tsx": "airing_today",
    "src/app/[locale]/(main)/tv/top-rated/page.tsx": "top_rated",
    "src/app/[locale]/(main)/tv/on-the-air/page.tsx": "on_the_air",
    "src/app/[locale]/(main)/movies/popular/page.tsx": "popular",
    "src/app/[locale]/(main)/movies/upcoming/page.tsx": "upcoming",
    "src/app/[locale]/(main)/movies/now-playing/page.tsx": "now_playing",
    "src/app/[locale]/(main)/movies/top-rated/page.tsx": "top_rated"
}

for path, nav_key in files.items():
    try:
        with open(path, 'r') as f:
            content = f.read()
            
        if "export async function generateMetadata" in content or "export function generateMetadata" in content:
            continue
            
        if "next-intl/server" not in content:
            content = "import { getTranslations } from \"next-intl/server\";\n" + content
        else:
            if "getTranslations" not in content:
                content = content.replace("from \"next-intl/server\"", ", getTranslations } from \"next-intl/server\"").replace("{ ,", "{")
        
        metadata_func = f"""
export async function generateMetadata({{ params }}: {{ params: Promise<{{ locale: string }}> }}) {{
  const {{ locale }} = await params;
  const t = await getTranslations({{ locale, namespace: "components.nav" }});
  return {{ title: t("{nav_key}") }};
}}

"""
        content = re.sub(r'(export default (async )?function)', metadata_func + r'\1', content)
        
        with open(path, 'w') as f:
            f.write(content)
        print(f"Updated {path}")
    except Exception as e:
        print(f"Failed {path}: {e}")
