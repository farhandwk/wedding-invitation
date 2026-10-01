'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  MessageCircle,
  UserRound,
  UsersRound,
  RefreshCw,
  Smartphone,
  Link as LinkIcon,
} from 'lucide-react';

import {
  GuestCategory,
  SpouseStatus,
  AttendanceStatus,
} from '@/models/Guest';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Badge,
} from '@/components/ui/badge';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';

import { Separator } from '@/components/ui/separator';

import { toast } from 'sonner';

interface GuestData {
  _id?: string;
  name: string;
  slug: string;
  phone: string;
  spouse: SpouseStatus;
  category: GuestCategory;
  isGroup: boolean;
  maxPax: number | string;
  attendance: AttendanceStatus;
  groupName?: string;
}

const initialForm: GuestData = {
  name: '',
  slug: '',
  phone: '',
  spouse: 'groom',
  category: 'public',
  isGroup: false,
  maxPax: 2,
  attendance: 'uncertain',
  groupName: '',
};

export default function AdminGuestsPage() {
  const [guests, setGuests] = useState<GuestData[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<GuestData>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [hasContactPicker, setHasContactPicker] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if ('contacts' in navigator && 'ContactsManager' in window) {
      setHasContactPicker(true);
    }

    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    setLoading(true);

    try {
      const res = await fetch('/api/admin/guests');
      const json = await res.json();

      if (json.success) {
        setGuests(json.data);
      }
    } catch {
      toast.error('Gagal mengambil data tamu');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handlePickContact = async () => {
    try {
      const props = ['name', 'tel'];

      const contacts = await (navigator as any).contacts.select(
        props,
        { multiple: false }
      );

      if (contacts && contacts.length > 0) {
        const picked = contacts[0];

        const rawName = picked.name?.[0] || '';
        const rawPhone = picked.tel?.[0] || '';

        const formattedPhone = rawPhone
          .replace(/[^0-9]/g, '')
          .replace(/^0/, '62');

        setFormData((prev) => ({
          ...prev,
          name: rawName,
          slug: generateSlug(rawName),
          phone: formattedPhone,
        }));
      }
    } catch {
      // User membatalkan picker
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const method = editingId ? 'PUT' : 'POST';

    const url = editingId
      ? `/api/admin/guests/${editingId}`
      : '/api/admin/guests';

    const payload = {
      ...formData,
      maxPax: Number(formData.maxPax) || 1,
    };

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message);
      }

      toast.success(
        editingId
          ? 'Data tamu berhasil diperbarui'
          : 'Tamu berhasil ditambahkan'
      );

      closeModal();
      fetchGuests();
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(
        `/api/admin/guests/${deleteId}`,
        {
          method: 'DELETE',
        }
      );

      if (!res.ok) {
        throw new Error();
      }

      setGuests((prev) =>
        prev.filter((guest) => guest._id !== deleteId)
      );

      toast.success('Data tamu berhasil dihapus');
    } catch {
      toast.error('Gagal menghapus data tamu');
    } finally {
      setDeleteId(null);
    }
  };

  const handleShareWA = async (guest: GuestData) => {
    const siteUrl = window.location.origin;

    const invLink =
      `${siteUrl}/invitation/${guest.slug}`;

    if (guest.isGroup) {
      const targetGroup =
        guest.groupName || guest.name;

      const groupText =
        `Halo rekan-rekan ${targetGroup}, ` +
        `kami mengundang kalian ke acara pernikahan kami. ` +
        `Silakan isi konfirmasi kehadiran pada tautan berikut:\n\n${invLink}`;

      try {
        await navigator.clipboard.writeText(targetGroup);
      } catch {
        // Ignore clipboard failure
      }

      window.open(
        `https://wa.me/?text=${encodeURIComponent(groupText)}`,
        '_blank'
      );
    } else {
      const personalText =
        `Halo ${guest.name}, kami mengundang Anda ` +
        `untuk hadir di acara pernikahan kami. ` +
        `Mohon konfirmasi kehadiran Anda melalui ` +
        `tautan khusus berikut:\n\n${invLink}`;

      window.open(
        `https://wa.me/${guest.phone}?text=${encodeURIComponent(personalText)}`,
        '_blank'
      );
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (guest: GuestData) => {
    setEditingId(guest._id || null);
    setFormData(guest);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(initialForm);
  };

  const filteredGuests = useMemo(() => {
    const keyword = search.toLowerCase();

    return guests.filter((guest) =>
      guest.name.toLowerCase().includes(keyword) ||
      guest.groupName?.toLowerCase().includes(keyword)
    );
  }, [guests, search]);

  const stats = useMemo(() => {
    return {
      total: guests.length,

      personal: guests.filter(
        (guest) => !guest.isGroup
      ).length,

      groups: guests.filter(
        (guest) => guest.isGroup
      ).length,

      attended: guests.filter(
        (guest) => guest.attendance === 'attending'
      ).length,
    };
  }, [guests]);

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Manajemen Tamu
            </h1>

            <p className="text-sm text-muted-foreground">
              Kelola daftar tamu dan pengiriman undangan WhatsApp.
            </p>
          </div>

          <Button onClick={openCreateModal}>
            <UserPlus className="mr-2 h-4 w-4" />
            Tambah Tamu
          </Button>
        </div>

        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            title="Total Tamu"
            value={stats.total}
            icon={<Users className="h-4 w-4" />}
          />

          <StatCard
            title="Personal"
            value={stats.personal}
            icon={<UserRound className="h-4 w-4" />}
          />

          <StatCard
            title="Grup WhatsApp"
            value={stats.groups}
            icon={<UsersRound className="h-4 w-4" />}
          />

          <StatCard
            title="Hadir"
            value={stats.attended}
            icon={<MessageCircle className="h-4 w-4" />}
          />

        </div>

        {/* Main Content */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <CardTitle className="text-base">
                  Daftar Tamu
                </CardTitle>

                <p className="mt-1 text-sm text-muted-foreground">
                  {filteredGuests.length} data ditampilkan
                </p>
              </div>

              <div className="relative w-full lg:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nama atau grup..."
                  className="pl-9"
                />
              </div>

            </div>
          </CardHeader>

          <Separator />

          <CardContent className="p-0">

            {/* Desktop */}
            <div className="hidden md:block">
              <Table>

                <TableHeader>
                  <TableRow>

                    <TableHead className="pl-6">
                      Tamu
                    </TableHead>

                    <TableHead>
                      Pihak
                    </TableHead>

                    <TableHead>
                      Kategori
                    </TableHead>

                    <TableHead>
                      Tipe
                    </TableHead>

                    <TableHead>
                      Kuota
                    </TableHead>

                    <TableHead>
                      Kehadiran
                    </TableHead>

                    <TableHead className="w-[100px] text-right pr-6">
                      Aksi
                    </TableHead>

                  </TableRow>
                </TableHeader>

                <TableBody>

                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="h-32 text-center"
                      >
                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Memuat data...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredGuests.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="h-32 text-center text-muted-foreground"
                      >
                        Tidak ada data tamu.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredGuests.map((guest) => (

                      <TableRow key={guest._id}>

                        <TableCell className="pl-6">
                          <div className="flex flex-col">

                            <span className="font-medium text-foreground">
                              {guest.name}
                            </span>

                            {guest.isGroup &&
                              guest.groupName && (
                                <span className="text-xs text-muted-foreground">
                                  {guest.groupName}
                                </span>
                              )}

                            {guest.phone && (
                              <span className="text-xs text-muted-foreground">
                                {guest.phone}
                              </span>
                            )}

                          </div>
                        </TableCell>

                        <TableCell>
                          <SpouseBadge
                            spouse={guest.spouse}
                          />
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="capitalize"
                          >
                            {guest.category}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          {guest.isGroup ? (
                            <Badge variant="outline">
                              <UsersRound className="mr-1 h-3 w-3" />
                              Grup
                            </Badge>
                          ) : (
                            <Badge variant="outline">
                              <UserRound className="mr-1 h-3 w-3" />
                              Personal
                            </Badge>
                          )}
                        </TableCell>

                        <TableCell>
                          {guest.maxPax} orang
                        </TableCell>

                        <TableCell>
                          <AttendanceBadge
                            attendance={guest.attendance}
                          />
                        </TableCell>

                        <TableCell className="pr-6">
                          <div className="flex justify-end gap-1">

                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() =>
                                handleShareWA(guest)
                              }
                              title="Kirim WhatsApp"
                            >
                              <MessageCircle className="h-4 w-4 text-green-600" />
                            </Button>

                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() =>
                                openEditModal(guest)
                              }
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>

                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() =>
                                setDeleteId(guest._id || null)
                              }
                              title="Hapus"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>

                          </div>
                        </TableCell>

                      </TableRow>

                    ))
                  )}

                </TableBody>
              </Table>
            </div>

            {/* Mobile */}
            <div className="space-y-3 p-4 md:hidden">

              {loading ? (
                <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Memuat data...
                </div>
              ) : filteredGuests.length === 0 ? (
                <div className="py-10 text-center text-sm text-muted-foreground">
                  Tidak ada data tamu.
                </div>
              ) : (
                filteredGuests.map((guest) => (

                  <div
                    key={guest._id}
                    className="rounded-lg border bg-background p-4"
                  >

                    <div className="flex items-start justify-between gap-3">

                      <div className="min-w-0">

                        <p className="truncate font-medium">
                          {guest.name}
                        </p>

                        {guest.isGroup &&
                          guest.groupName && (
                            <p className="mt-0.5 truncate text-xs text-muted-foreground">
                              {guest.groupName}
                            </p>
                          )}

                        <p className="mt-1 text-xs text-muted-foreground">
                          {guest.phone || 'Tidak ada nomor'}
                        </p>

                      </div>

                      <AttendanceBadge
                        attendance={guest.attendance}
                      />

                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <SpouseBadge
                        spouse={guest.spouse}
                      />

                      <Badge
                        variant="secondary"
                        className="capitalize"
                      >
                        {guest.category}
                      </Badge>

                      <Badge variant="outline">
                        {guest.isGroup
                          ? 'Grup WA'
                          : 'Personal'}
                      </Badge>

                      <Badge variant="outline">
                        {guest.maxPax} pax
                      </Badge>
                    </div>

                    <Separator className="my-4" />

                    <div className="flex gap-2">

                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() =>
                          handleShareWA(guest)
                        }
                      >
                        <MessageCircle className="mr-2 h-4 w-4 text-green-600" />
                        WhatsApp
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          openEditModal(guest)
                        }
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          setDeleteId(guest._id || null)
                        }
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>

                    </div>

                  </div>

                ))
              )}

            </div>

          </CardContent>
        </Card>

      </div>

      {/* Create / Edit Dialog */}
      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open) closeModal();
        }}
      >

        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">

          <DialogHeader>
            <DialogTitle>
              {editingId
                ? 'Edit Data Tamu'
                : 'Tambah Tamu'}
            </DialogTitle>

            <DialogDescription>
              Masukkan informasi tamu untuk kebutuhan
              undangan dan konfirmasi kehadiran.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Contact Picker */}
            {hasContactPicker && !editingId && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handlePickContact}
              >
                <Smartphone className="mr-2 h-4 w-4" />
                Pilih dari Kontak HP
              </Button>
            )}

            {/* Invitation Type */}
            <div className="space-y-3">

              <Label>
                Tipe Undangan
              </Label>

              <RadioGroup
                value={formData.isGroup ? 'group' : 'personal'}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    isGroup: value === 'group',
                  })
                }
                className="grid grid-cols-2 gap-3"
              >

                <Label
                  htmlFor="personal"
                  className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-muted/50"
                >
                  <RadioGroupItem
                    value="personal"
                    id="personal"
                  />

                  <div>
                    <p className="text-sm font-medium">
                      Personal
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Satu orang / keluarga
                    </p>
                  </div>
                </Label>

                <Label
                  htmlFor="group"
                  className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-muted/50"
                >
                  <RadioGroupItem
                    value="group"
                    id="group"
                  />

                  <div>
                    <p className="text-sm font-medium">
                      Grup WA
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Undangan melalui grup
                    </p>
                  </div>
                </Label>

              </RadioGroup>

            </div>

            {/* Name */}
            <div className="space-y-2">

              <Label htmlFor="name">
                {formData.isGroup
                  ? 'Nama Label Link'
                  : 'Nama Tamu'}
              </Label>

              <Input
                id="name"
                required
                placeholder={
                  formData.isGroup
                    ? 'Contoh: Alumni SMA 1'
                    : 'Contoh: Budi Santoso'
                }
                value={formData.name}
                onChange={(e) => {
                  const name = e.target.value;

                  setFormData({
                    ...formData,
                    name,
                    slug: editingId
                      ? formData.slug
                      : generateSlug(name),
                  });
                }}
              />

            </div>

            {/* Group Name */}
            {formData.isGroup && (
              <div className="space-y-2">

                <Label htmlFor="groupName">
                  Nama Grup WhatsApp
                </Label>

                <Input
                  id="groupName"
                  placeholder="Contoh: Grup WA Angkatan 2018"
                  value={formData.groupName || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      groupName: e.target.value,
                    })
                  }
                />

              </div>
            )}

            {/* Slug */}
            <div className="space-y-2">

              <Label htmlFor="slug">
                URL Slug
              </Label>

              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="slug"
                  required
                  className="pl-9"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      slug: generateSlug(
                        e.target.value
                      ),
                    })
                  }
                />
              </div>

              <p className="text-xs text-muted-foreground">
                /invitation/{formData.slug}
              </p>

            </div>

            {/* Phone */}
            <div className="space-y-2">

              <Label htmlFor="phone">
                Nomor WhatsApp
              </Label>

              <Input
                id="phone"
                placeholder="6281234567890"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone: e.target.value,
                  })
                }
              />

              <p className="text-xs text-muted-foreground">
                Gunakan format internasional, contoh 62812...
              </p>

            </div>

            {/* Spouse + Category */}
            <div className="grid grid-cols-2 gap-4">

              <div className="space-y-2">
                <Label>Pihak Mempelai</Label>

                <Select
                  value={formData.spouse}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      spouse:
                        value as SpouseStatus,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="groom">
                      Pria
                    </SelectItem>

                    <SelectItem value="bride">
                      Wanita
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Kategori</Label>

                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      category:
                        value as GuestCategory,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="public">
                      Umum
                    </SelectItem>

                    <SelectItem value="friend">
                      Teman
                    </SelectItem>

                    <SelectItem value="family">
                      Keluarga
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </div>

            {/* Pax */}
            <div className="space-y-2">

              <Label htmlFor="maxPax">
                Batas Maksimal Pax
              </Label>

              <Input
                id="maxPax"
                type="number"
                min={1}
                max={10}
                value={formData.maxPax}
                onChange={(e) => {
                  const value = e.target.value;

                  setFormData({
                    ...formData,
                    maxPax:
                      value === ''
                        ? ''
                        : parseInt(value, 10),
                  });
                }}
              />

              <p className="text-xs text-muted-foreground">
                Jumlah maksimal orang yang dapat
                dikonfirmasi pada undangan.
              </p>

            </div>

            <DialogFooter className="gap-2 sm:gap-0">

              <Button
                type="button"
                variant="outline"
                onClick={closeModal}
              >
                Batal
              </Button>

              <Button type="submit">
                {editingId
                  ? 'Simpan Perubahan'
                  : 'Tambah Tamu'}
              </Button>

            </DialogFooter>

          </form>

        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
      >

        <AlertDialogContent>

          <AlertDialogHeader>
            <AlertDialogTitle>
              Hapus data tamu?
            </AlertDialogTitle>

            <AlertDialogDescription>
              Data tamu yang dihapus tidak dapat
              dikembalikan. Pastikan kamu benar-benar
              ingin menghapus data ini.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>

            <AlertDialogCancel>
              Batal
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>

          </AlertDialogFooter>

        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}


/* -------------------------------------------------------------------------- */
/* Components                                                                 */
/* -------------------------------------------------------------------------- */

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-5">

        <div>
          <p className="text-sm text-muted-foreground">
            {title}
          </p>

          <p className="mt-1 text-2xl font-semibold tracking-tight">
            {value}
          </p>
        </div>

        <div className="rounded-lg border bg-muted p-2.5">
          {icon}
        </div>

      </CardContent>
    </Card>
  );
}


function SpouseBadge({
  spouse,
}: {
  spouse: SpouseStatus;
}) {
  return (
    <Badge variant="outline">
      {spouse === 'groom'
        ? 'Pria'
        : 'Wanita'}
    </Badge>
  );
}


function AttendanceBadge({
  attendance,
}: {
  attendance: AttendanceStatus;
}) {
  const config = {
    attending: {
      label: 'Hadir',
      className:
        'border-green-200 bg-green-50 text-green-700',
    },

    not_attending: {
      label: 'Tidak Hadir',
      className:
        'border-red-200 bg-red-50 text-red-700',
    },

    uncertain: {
      label: 'Belum Konfirmasi',
      className:
        'border-yellow-200 bg-yellow-50 text-yellow-700',
    },
  };

  const current =
    config[attendance as keyof typeof config] ??
    config.uncertain;

  return (
    <Badge
      variant="outline"
      className={current.className}
    >
      {current.label}
    </Badge>
  );
}