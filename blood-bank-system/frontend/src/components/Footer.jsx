import React from 'react';
import { Droplet, Phone, Mail, MapPin, Heart, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center">
                <Droplet className="w-4 h-4 fill-current" />
              </div>
              <span className="text-lg font-black text-white tracking-tight">
                LIFELINE <span className="text-red-500">NETWORK</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Lifeline is a digital blood banking infrastructure coordinating donors, hospitals,
              and patients with real-time stock monitoring and rapid emergency dispatch.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
              <span>Saving lives 24 hours a day, 365 days a year</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/" className="hover:text-red-400 transition-colors">
                  Home Portal
                </Link>
              </li>
              <li>
                <Link to="/inventory" className="hover:text-red-400 transition-colors">
                  Real-time Blood Stock
                </Link>
              </li>
              <li>
                <Link to="/camps" className="hover:text-red-400 transition-colors">
                  Donation Camps & Drives
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-red-400 transition-colors">
                  Register as a Donor
                </Link>
              </li>
            </ul>
          </div>

          {/* Emergency Hotline */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Emergency Services
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-950/40 border border-red-900/50">
                <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-red-200">24/7 Blood Dispatch Hotline</div>
                  <div className="text-red-300/80 font-mono text-xs">+1 (800) 555-BLOOD</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Phone className="w-4 h-4 text-slate-500" />
                <span>Hospital Desk: +1 (555) 019-2834</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Mail className="w-4 h-4 text-slate-500" />
                <span>support@lifeline.org</span>
              </div>
            </div>
          </div>

          {/* Location & Safety */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Central Facility
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span>
                  Central Life Blood Bank & Research Institute, Metro Medical Complex, 4th Avenue
                </span>
              </div>
              <p className="pt-2 text-[11px] text-slate-500">
                Licensed under National Health Blood Transfusion Guidelines. ISO 9001:2015 Certified Blood Facility.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>&copy; {new Date().getFullYear()} Lifeline Blood Bank Management System. All rights reserved.</div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Donor Safety Guidelines</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
