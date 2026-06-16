"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  PawPrint, 
  Search, 
  Heart, 
  Home, 
  Dog, 
  Cat, 
  Rabbit, 
  Bird, 
  Users, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Calendar,
  Trophy,
  Sparkles
} from "lucide-react";

export default function AboutPage() {
  const [dbStats, setDbStats] = useState({
    total: 0,
    adopted: 0,
    districts: 25,
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/pets").then((r) => r.json()),
      fetch("/api/pets?adopted=true").then((r) => r.json()),
    ])
      .then(([all, adopted]) => {
        const total = Array.isArray(all) ? all.length : 0;
        const adoptions = Array.isArray(adopted) ? adopted.length : 0;
        const uniqueDistricts = Array.isArray(all) 
          ? new Set(all.map((p: any) => p.location)).size 
          : 25;
        
        setDbStats({
          total: total,
          adopted: adoptions,
          districts: uniqueDistricts,
        });
      })
      .catch(() => {});
  }, []);

  const stats = [
    { value: `${dbStats.total}`, label: "Pets Listed", icon: PawPrint },
    { value: `${dbStats.adopted}`, label: "Successful Adoptions", icon: Heart },
    { value: `${dbStats.districts}`, label: "Districts Covered", icon: MapPin },
    { value: "100%", label: "Free Platform", icon: Sparkles },
  ];

  const features = [
    {
      icon: PawPrint,
      title: "Find Pets Near You",
      description:
        "Browse pets from across Sri Lanka and discover your perfect companion.",
    },
    {
      icon: Search,
      title: "Smart Search",
      description:
        "Filter by location, age, gender, and species to find the right match.",
    },
    {
      icon: ShieldCheck,
      title: "Safe Adoption",
      description:
        "Connect directly with pet owners and rescuers through verified listings.",
    },
    {
      icon: Home,
      title: "Second Chances",
      description:
        "Help animals find loving homes and brighter futures.",
    },
  ];

  const processSteps = [
    { title: "Browse Pets", icon: PawPrint },
    { title: "Contact Owner", icon: Phone },
    { title: "Meet & Verify", icon: Users },
    { title: "Bring Home", icon: Home },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#FFF7FA] to-white">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        {/* Abstract background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#FFE4EC] rounded-full blur-3xl opacity-60" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#FFF0F5] rounded-full blur-3xl opacity-60" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-4 lg:py-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Column */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-[#F3D6DF]">
                <PawPrint className="w-4 h-4 text-[#FF5C8A]" />
                <span className="text-[#FF5C8A] font-semibold text-sm">
                  Your Trusted Adoption Partner
                </span>
              </div>

              <h1 className="mt-6 text-5xl lg:text-7xl font-bold text-[#2B1B22] leading-tight">
                Every Pet Deserves a
                <span className="text-[#FF5C8A] block"> Loving Home</span>
              </h1>

              <p className="mt-6 text-lg text-[#5A3B45] leading-relaxed max-w-lg">
                Connecting rescued animals, shelters, and loving families
                across Sri Lanka through a simple and trusted adoption platform.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/dogs"
                  className="group px-8 py-4 rounded-xl bg-[#FF5C8A] hover:bg-[#E94C77] text-white font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <PawPrint className="w-5 h-5" />
                  Browse Pets
                </Link>

                <Link
                  href="/list-for-adoption"
                  className="group px-8 py-4 rounded-xl border-2 border-[#F3D6DF] bg-white hover:bg-[#FFF0F5] text-[#2B1B22] font-semibold transition-all hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <Heart className="w-5 h-5 text-[#FF5C8A]" />
                  List for Adoption
                </Link>
              </div>
            </div>

            {/* Right Column - Hero Image */}
            <div className="relative">
              <div className="relative h-[480px] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-[#F3D6DF]">
                <Image
                  src="/images/homepage/hero2.jpg"
                  alt="Happy dog and cat together"
                  fill
                  className="object-cover"
                  priority
                />
                
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* MISSION SECTION */}
      <section className="py-8 relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF0F5] mb-6">
            <Heart className="w-4 h-4 text-[#FF5C8A]" />
            <span className="text-sm font-medium text-[#FF5C8A]">Our Purpose</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-[#2B1B22]">
            Giving Every Animal a <span className="text-[#FF5C8A]">Second Chance</span>
          </h2>

          <p className="mt-8 text-xl text-[#5A3B45] leading-relaxed">
            Perfect Companion was built from the heart to make pet adoption easier, safer,
            and more accessible. We believe every animal deserves a loving
            family and every family deserves the joy of a loyal companion.
          </p>
          
          <div className="mt-8 flex justify-center">
            <div className="w-20 h-1 bg-[#FF5C8A] rounded-full" />
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((item) => (
              <div
                key={item.label}
                className="group bg-white rounded-2xl border border-[#F3D6DF] p-8 text-center hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#FFF0F5] group-hover:bg-[#FF5C8A] transition-colors mb-4">
                  <item.icon className="w-7 h-7 text-[#FF5C8A] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-4xl font-bold text-[#2B1B22]">
                  {item.value}
                </h3>
                <p className="mt-2 text-[#5A3B45] font-medium">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#2B1B22]">
              Why Choose <span className="text-[#FF5C8A]">Perfect Companion</span>
            </h2>
            <p className="mt-4 text-lg text-[#5A3B45] max-w-2xl mx-auto">
              Built with love and care to make pet adoption a joyful experience for everyone
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group bg-white p-8 rounded-2xl border border-[#F3D6DF] hover:shadow-xl transition-all hover:-translate-y-2"
              >
                <div className="w-14 h-14 rounded-xl bg-[#FFF0F5] group-hover:bg-[#FF5C8A] transition-colors flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-[#FF5C8A] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-[#2B1B22] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#5A3B45] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ADOPTION PROCESS SECTION */}
      <section className="py-8 bg-[#FFF0F5] relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#FFE4EC] rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#2B1B22]">
              Simple <span className="text-[#FF5C8A]">4-Step</span> Process
            </h2>
            <p className="mt-4 text-lg text-[#5A3B45]">
              Finding your perfect companion has never been easier
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div
                key={step.title}
                className="relative text-center"
              >
                {/* Connector line */}
                {index < 3 && (
                  <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-[#F3D6DF] -translate-x-1/2" />
                )}
                
                <div className="relative inline-flex flex-col items-center">
                  <div className="w-20 h-20 rounded-2xl bg-white shadow-lg flex items-center justify-center mb-4 ring-2 ring-[#FFE4EC]">
                    <step.icon className="w-8 h-8 text-[#FF5C8A]" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#FF5C8A] text-white flex items-center justify-center font-bold text-sm shadow-md">
                    {index + 1}
                  </div>
                </div>
                <h3 className="mt-4 text-xl font-bold text-[#2B1B22]">
                  {step.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PERSONAL NOTE & CTA SECTION */}
      <section className="py-8">
        <div className="max-w-5xl mx-auto px-6">
          <div className="rounded-3xl bg-gradient-to-br from-[#FF5C8A] to-[#FF8FA3] p-12 text-center shadow-xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-6">
              <Heart className="w-4 h-4 text-white" />
              <span className="text-white font-medium">Made with Love</span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-white">
              Ready to Meet Your New Best Friend?
            </h2>

            <p className="mt-4 text-white/90 text-lg max-w-2xl mx-auto">
              Start your adoption journey today and help a pet find a forever home.
              Every adoption changes a life — both yours and theirs.
            </p>

            <div className="mt-10 flex justify-center flex-wrap gap-4">
              <Link
                href="/dogs"
                className="group px-8 py-4 rounded-xl bg-white text-[#FF5C8A] font-semibold hover:shadow-lg transition-all hover:-translate-y-0.5 flex items-center gap-2"
              >
                <PawPrint className="w-5 h-5" />
                Browse Available Pets
              </Link>

              <Link
                href="/list-for-adoption"
                className="group px-8 py-4 rounded-xl border-2 border-white text-white font-semibold hover:bg-white/10 transition-all hover:-translate-y-0.5 flex items-center gap-2"
              >
                <Heart className="w-5 h-5" />
                List a Pet for Adoption
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CREATOR'S NOTE */}
      <section className="pb-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="border-t border-[#F3D6DF] pt-12">
            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-[#FFF0F5]">
              <Sparkles className="w-5 h-5 text-[#FF5C8A]" />
              <p className="text-[#5A3B45]">
                <span className="font-semibold text-[#2B1B22]">Perfect Companion</span> — Built with dedication to help animals find loving homes across Sri Lanka.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}