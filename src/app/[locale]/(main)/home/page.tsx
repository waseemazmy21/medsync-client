import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Heart, Shield, Users } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

function Page() {
  const t = useTranslations('home');
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {t("heroTitle")} <span className="text-primary">{t("heroTitleAccent")}</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            {t("heroDesc")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                {t("startJourney")}
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                {t("signIn")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t("featuresTitle")}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">{t("featuresDesc")}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg bg-gray-50 dark:bg-gray-800">
              <CardHeader>
                <Calendar className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-gray-900 dark:text-white">{t("feature1Title")}</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  {t("feature1Desc")}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg bg-gray-50 dark:bg-gray-800">
              <CardHeader>
                <Users className="h-12 w-12 text-secondary mb-4" />
                <CardTitle  className="text-gray-900 dark:text-white">{t("feature2Title")}</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  {t("feature2Desc")}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg bg-gray-50 dark:bg-gray-800">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" />
                <CardTitle  className="text-gray-900 dark:text-white">{t("feature3Title")}</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  {t("feature3Desc")}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{t("ctaTitle")}</h2>
          <p className="text-xl text-blue-100 mb-8">
            {t("ctaDesc")}
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary">
              {t("createAccount")}
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-6 w-6" />
            <span className="text-xl font-bold">MedSync</span>
          </div>
          <p className="text-gray-400 dark:text-gray-500">{t("footerTagline")}</p>
        </div>
      </footer>
    </div>
  );
}

export default Page
