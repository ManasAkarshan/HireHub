import supabase, { supabaseUrl } from "@/utils/supabase/client";

export async function getCurrentUser() {
  const { data: session, error } = await supabase.auth.getSession();
  if (!session) return null;

  if (error) throw new Error(error.message);

  return session.session?.user;
  // STRUCTURE OF SESSION
  // {
  //     data: {
  //       session: {
  //         user: { /* user details */ }, // other session properties like access token, etc.
  //       }
  //     },
  //     error: null // if there's an error, it will be here
  //   }
}

export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function signUp({ name, email, password, profile_pic }) {
  const fileName = `dp-${name.split(" ").join("-")}-${Math.random()}`;
  const { error: storageError } = await supabase.storage
    .from("profile_pic")
    .upload(fileName, profile_pic);
  if (storageError) throw new Error(storageError.message);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        profile_pic: `${supabaseUrl}/storage/v1/object/public/profile_pic/${fileName}`,
      },
    },
  });
  if (error) throw new Error(error.message);

  return data;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}
