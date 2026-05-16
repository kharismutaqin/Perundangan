import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Calendar, Clock, Heart, Send } from "lucide-react";
import { kontenUndangan } from "../../KontenEditor";

const Ornament = ({ className }: { className?: string }) => (
  <svg
    className={`opacity-30 ${className}`}
    width="120"
    height="30"
    viewBox="0 0 120 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M60 15C50 15 45 5 30 5C15 5 10 25 0 25M60 15C70 15 75 5 90 5C105 5 110 25 120 25M60 15C58 10 55 5 60 5C65 5 62 10 60 15ZM60 15C58 20 55 25 60 25C65 25 62 20 60 15Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" as const },
  },
};

const rsvpSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  attendance: z.enum(["Hadir", "Tidak Hadir", "Masih Belum Pasti"]),
  guests: z.coerce.number().min(1).max(10),
  wishes: z.string().optional(),
});

type RsvpFormValues = z.infer<typeof rsvpSchema>;

export default function Invitation() {
  const [guestName, setGuestName] = useState<string>("Tamu Undangan");
  const [isOpened, setIsOpened] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<RsvpFormValues>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      name: "",
      attendance: "Hadir",
      guests: 1,
      wishes: "",
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nameFromUrl = params.get("to");
    if (nameFromUrl) {
      setGuestName(nameFromUrl);
      setValue("name", nameFromUrl);
    }
  }, [setValue]);

  useEffect(() => {
    const weddingDate = new Date("2025-06-14T08:00:00").getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = weddingDate - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const onOpen = () => {
    setIsOpened(true);
    setTimeout(() => {
      document.getElementById("mempelai")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const onSubmitRSVP = (data: RsvpFormValues) => {
    const message = `Halo, saya ${data.name} ingin konfirmasi kehadiran untuk pernikahan ${kontenUndangan.footer.judul}.
Kehadiran: ${data.attendance}
Jumlah Tamu: ${data.guests} orang
Ucapan: ${data.wishes || "-"}`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${kontenUndangan.rsvp.nomorWhatsapp}?text=${encodedMessage}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground font-sans overflow-x-hidden">
      {/* 1. Cover / Hero Section */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center p-6 text-center border-b-8 border-primary/10">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="z-10 max-w-md w-full bg-card/50 backdrop-blur-sm p-8 rounded-3xl border border-primary/10 shadow-xl"
        >
          <Ornament className="mx-auto text-primary mb-6" />
          <p className="tracking-[0.2em] text-sm uppercase text-muted-foreground mb-4">
            The Wedding Of
          </p>
          <h1 className="font-serif text-5xl md:text-6xl text-primary mb-6 leading-tight">
            {kontenUndangan.namaMempelai.pria.split(" ")[0]} <br />
            <span className="text-3xl italic text-primary/70">&amp;</span> <br />
            {kontenUndangan.namaMempelai.wanita.split(" ")[0]}
          </h1>
          
          <div className="my-8 h-[1px] w-24 bg-primary/20 mx-auto"></div>

          <div className="mb-8">
            <p className="text-sm text-muted-foreground mb-2">Kepada Yth. Bapak/Ibu/Saudara/i:</p>
            <p className="font-serif text-xl md:text-2xl font-medium">{guestName}</p>
          </div>

          {!isOpened && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                onClick={onOpen}
                size="lg"
                className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 shadow-lg shadow-primary/20 transition-all hover:scale-105"
              >
                <Heart className="w-4 h-4 mr-2" /> Buka Undangan
              </Button>
            </motion.div>
          )}
        </motion.div>
      </section>

      <AnimatePresence>
        {isOpened && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* 2. Profil Mempelai */}
            <section id="mempelai" className="py-24 px-6 relative">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={sectionVariants}
                className="max-w-4xl mx-auto text-center"
              >
                <Ornament className="mx-auto text-primary mb-8" />
                <h2 className="font-serif text-3xl md:text-4xl text-primary mb-12">
                  Profil Mempelai
                </h2>
                
                <p className="text-muted-foreground mb-16 max-w-2xl mx-auto leading-relaxed">
                  Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan pernikahan putra-putri kami:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative">
                  {/* Groom */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-48 h-48 md:w-56 md:h-56 rounded-full p-2 border-2 border-primary/20 mb-6 shadow-xl">
                      <img
                        src={kontenUndangan.fotoMempelai.pria}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <h3 className="font-serif text-2xl font-medium mb-2 text-primary">{kontenUndangan.namaMempelai.pria}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Putra dari<br />
                      {kontenUndangan.orangTua.pria}
                    </p>
                  </div>

                  {/* AND Separator */}
                  <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-5xl italic text-primary/30">
                    &amp;
                  </div>
                  <div className="md:hidden font-serif text-4xl italic text-primary/30 my-2">
                    &amp;
                  </div>

                  {/* Bride */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-48 h-48 md:w-56 md:h-56 rounded-full p-2 border-2 border-primary/20 mb-6 shadow-xl">
                      <img
                        src={kontenUndangan.fotoMempelai.wanita}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <h3 className="font-serif text-2xl font-medium mb-2 text-primary">{kontenUndangan.namaMempelai.wanita}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Putri dari<br />
                      {kontenUndangan.orangTua.wanita}
                    </p>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* 3. Detail Acara & Lokasi */}
            <section className="py-24 px-6 bg-card/50 border-y border-primary/10">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={sectionVariants}
                className="max-w-4xl mx-auto"
              >
                <div className="text-center mb-16">
                  <Ornament className="mx-auto text-primary mb-8" />
                  <h2 className="font-serif text-3xl md:text-4xl text-primary mb-4">
                    Waktu &amp; Tempat
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                  <div className="bg-background p-8 rounded-3xl shadow-lg border border-primary/5 text-center flex flex-col items-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                      <Heart className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif text-2xl mb-4 text-foreground">Akad Nikah</h3>
                    <div className="space-y-3 text-muted-foreground">
                      <p className="flex items-center justify-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" /> {kontenUndangan.acara.akad.tanggal}
                      </p>
                      <p className="flex items-center justify-center gap-2">
                        <Clock className="w-4 h-4 text-primary" /> {kontenUndangan.acara.akad.waktu}
                      </p>
                    </div>
                  </div>

                  <div className="bg-background p-8 rounded-3xl shadow-lg border border-primary/5 text-center flex flex-col items-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                      <Heart className="w-5 h-5" fill="currentColor" />
                    </div>
                    <h3 className="font-serif text-2xl mb-4 text-foreground">Resepsi</h3>
                    <div className="space-y-3 text-muted-foreground">
                      <p className="flex items-center justify-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" /> {kontenUndangan.acara.resepsi.tanggal}
                      </p>
                      <p className="flex items-center justify-center gap-2">
                        <Clock className="w-4 h-4 text-primary" /> {kontenUndangan.acara.resepsi.waktu}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-center bg-primary/5 rounded-3xl p-8 border border-primary/10">
                  <MapPin className="w-8 h-8 text-primary mx-auto mb-4" />
                  <h4 className="font-serif text-xl mb-2 font-medium">{kontenUndangan.lokasi.nama}</h4>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    {kontenUndangan.lokasi.alamat}
                  </p>
                  <Button
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-full px-6"
                    onClick={() => window.open(kontenUndangan.lokasi.mapsUrl, "_blank")}
                  >
                    <MapPin className="w-4 h-4 mr-2" /> Buka Google Maps
                  </Button>
                </div>

                {/* Countdown */}
                <div className="mt-16 text-center">
                  <p className="tracking-widest uppercase text-xs text-muted-foreground mb-6">Menuju Hari Bahagia</p>
                  <div className="flex justify-center gap-4 md:gap-8">
                    {Object.entries(timeLeft).map(([unit, value]) => (
                      <div key={unit} className="flex flex-col items-center">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-background shadow-md rounded-2xl flex items-center justify-center border border-primary/10 mb-2">
                          <span className="font-serif text-2xl md:text-3xl text-primary">{value}</span>
                        </div>
                        <span className="text-xs uppercase tracking-wider text-muted-foreground">
                          {unit === 'days' ? 'Hari' : unit === 'hours' ? 'Jam' : unit === 'minutes' ? 'Menit' : 'Detik'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </section>

            {/* 4. Galeri Foto */}
            <section className="py-24 px-6 relative overflow-hidden">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={sectionVariants}
                className="max-w-5xl mx-auto"
              >
                <div className="text-center mb-16">
                  <Ornament className="mx-auto text-primary mb-8" />
                  <h2 className="font-serif text-3xl md:text-4xl text-primary mb-4">
                    Prewedding Gallery
                  </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {kontenUndangan.galeri.map((url, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md"
                    >
                      <img
                        src={url}
                        alt={`Prewedding ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300"></div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </section>

            {/* 5. RSVP Form */}
            <section className="py-24 px-6 bg-card/50 border-t border-primary/10">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={sectionVariants}
                className="max-w-2xl mx-auto"
              >
                <div className="text-center mb-12">
                  <Ornament className="mx-auto text-primary mb-8" />
                  <h2 className="font-serif text-3xl md:text-4xl text-primary mb-4">
                    RSVP &amp; Ucapan
                  </h2>
                  <p className="text-muted-foreground">
                    Kehadiran Anda adalah hadiah terindah bagi kami.
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmitRSVP)} className="space-y-6 bg-background p-8 rounded-3xl shadow-xl border border-primary/5">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="name"
                          placeholder="Masukkan nama Anda"
                          className="bg-muted/50 border-primary/20 focus-visible:ring-primary"
                        />
                      )}
                    />
                    {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                  </div>

                  <div className="space-y-3">
                    <Label>Konfirmasi Kehadiran</Label>
                    <Controller
                      name="attendance"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Hadir" id="hadir" />
                            <Label htmlFor="hadir" className="font-normal">Hadir</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Tidak Hadir" id="tidak-hadir" />
                            <Label htmlFor="tidak-hadir" className="font-normal">Tidak Hadir</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Masih Belum Pasti" id="belum-pasti" />
                            <Label htmlFor="belum-pasti" className="font-normal">Masih Belum Pasti</Label>
                          </div>
                        </RadioGroup>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guests">Jumlah Tamu</Label>
                    <Controller
                      name="guests"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="guests"
                          type="number"
                          min={1}
                          max={10}
                          className="bg-muted/50 border-primary/20 focus-visible:ring-primary w-full md:w-1/3"
                        />
                      )}
                    />
                    {errors.guests && <p className="text-sm text-destructive">{errors.guests.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="wishes">Ucapan &amp; Doa</Label>
                    <Controller
                      name="wishes"
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          id="wishes"
                          placeholder="Berikan ucapan dan doa untuk mempelai"
                          className="bg-muted/50 border-primary/20 focus-visible:ring-primary min-h-[120px] resize-none"
                        />
                      )}
                    />
                  </div>

                  <Button type="submit" className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg">
                    <Send className="w-4 h-4 mr-2" /> Kirim via WhatsApp
                  </Button>
                </form>
              </motion.div>
            </section>

            {/* 6. Footer */}
            <footer className="py-16 text-center bg-primary text-primary-foreground">
              <Ornament className="mx-auto mb-8 text-primary-foreground/50" />
              <h2 className="font-serif text-3xl mb-2">{kontenUndangan.footer.judul}</h2>
              <p className="tracking-widest text-sm mb-6 text-primary-foreground/80">{kontenUndangan.footer.tanggal}</p>
              <p className="text-sm text-primary-foreground/60 italic font-serif">
                Terima kasih atas doa dan kehadiran Anda.
              </p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
