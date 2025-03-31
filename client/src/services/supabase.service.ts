import { Injectable } from '@angular/core'
import {
  AuthChangeEvent,
  AuthError,
  AuthSession,
  createClient,
  Session,
  SupabaseClient,
  User,
} from '@supabase/supabase-js/dist/module/index.js';
import { environment } from '../environments/environment'
import { Database } from '../types/database.types';
import { Observable, Subject, Subscription } from 'rxjs';

export interface Profile {
  id?: string
  avatar_url: string
}

export interface Destination {
  id: number;
  Destination: string;
  Region: string;
  Country: string;
  Description?: string;
  Latitude?: number;
  Longitude?: number;
  Best_time_to_visit?: string;
  Average_temperature?: number;
}

export interface DestinationList {
  id?: number;
  user_id: string;
  name: string;
  description?: string;
  is_public: boolean;
  destinations: string[];
  created_at: Date;
  updated_at: Date;
}

export interface DestinationListWithDetails extends DestinationList {
  destinations_details?: Destination[]; // Full destination details
}

export interface ListReview {
  id?: number;
  list_id: number;
  user_id: string;
  username: string;
  rating: number;
  comment: string;
  created_at: Date;
}


@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;
  // using a subject here, emits observables and can receive observables
  private authSubject = new Subject<{ event: string, session: Session | null }>();

  constructor() {
    this.supabase = createClient<Database>(environment.supabaseUrl, environment.supabaseKey, {
      auth: {
        persistSession: true
      }
    }); 
    // auth change listener
    this.supabase.auth.onAuthStateChange((event, session) => {
      this.authSubject.next({ event, session });
    });
  }
  
  async getSession(): Promise<{ data: { session: Session | null }; error: AuthError | null }> {
    return this.supabase.auth.getSession();
  }

  profile(user: User) {
    return this.supabase
      .from('profiles')
      .select(`username, website, avatar_url`)
      .eq('id', user.id)
      .single()
  }

  async searchDestinations(name: string = '', region: string = '', country: string = '', resultLimit: number = 5) {
    try {
      console.log('Search parameters:', { name, region, country });
      let query = this.supabase.from('Destinations').select('*');
  
      // reject empty fields from the search
      if (name && name.trim() !== '') {
        query = query.ilike('Destination', `${name.trim()}%`);
      }
    
      if (region && region.trim() !== '') {
        query = query.ilike('Region', `${region.trim()}%`);
      }
    
      if (country && country.trim() !== '') {
        query = query.ilike('Country', `${country.trim()}%`);
      } 
  
      query = query.limit(resultLimit); // limit the number of results shown

      const { data, error } = await query;
      console.log('basic query:', await query);
      console.log('Query Results:', data);
    if (error) {
      console.error('Query Error:', error);
    }

      return { data, error }; // Ensure you're returning an object
    } catch (err) {
      console.error('Unexpected error in searchDestinations:', err);
      return { data: null, error: err };
    }
  }

  // emit observable authcange events
  authChanges(): Observable<{ event: AuthChangeEvent; session: Session | null }> {
    return new Observable((observer) => {
      const { data: { subscription } } = this.supabase.auth.onAuthStateChange((event, session) => {
        observer.next({ event, session });
      });
  
      // Cleanup: Unsubscribe when the observer unsubscribes
      return () => subscription.unsubscribe();
    });
  }

  async getCurrentUser(): Promise<User | null> {
    const { data } = await this.getSession();
    return data.session?.user || null;
  }

  async getCurrentUserId(): Promise<string | null> {
    const user = await this.getCurrentUser();
    return user?.id || null;
  }

  async getCurrentUsername(): Promise<string | null> {
    const user = await this.getCurrentUser();
    return user?.email?.split('@')[0] || null; // Fallback to email username
  }

  signIn(email: string) {
    return this.supabase.auth.signInWithOtp({ email })
  }

  signOut() {
    return this.supabase.auth.signOut();
  }

  updateProfile(profile: Profile) {
    const update = {
      ...profile,
      updated_at: new Date(),
    }

    return this.supabase.from('profiles').upsert(update)
  }

  downLoadImage(path: string) {
    return this.supabase.storage.from('avatars').download(path)
  }

  uploadAvatar(filePath: string, file: File) {
    return this.supabase.storage.from('avatars').upload(filePath, file)
  }


  // *** User list creation *** //
  async createDestinationList(list: Partial<DestinationList>): Promise<{ data: DestinationList | null, error: any }> {
    // Validate required attributes
    if (!list.name || !list.user_id) {
      return { data: null, error: 'Name and user_id are required' };
    }

    // Check if user already has a list with this name
    const { data: existingLists, error: checkError } = await this.supabase
      .from('destination_lists')
      .select('*')
      .eq('user_id', list.user_id)
      .eq('name', list.name)
      .single();

    if (existingLists) {
      return { data: null, error: 'A list with this name already exists' };
    }

    // Check if user has reached the maximum number of lists
    const { count, error: countError } = await this.supabase
      .from('destination_lists')
      .select('*', { count: 'exact' })
      .eq('user_id', list.user_id);

    if (count && count >= 20) {
      return { data: null, error: 'Maximum number of lists (20) reached' };
    }

    // Prepare list data
    const listToCreate = {
      user_id: list.user_id,
      name: list.name,
      description: list.description || null,
      is_public: false, // Default to private
      destinations: list.destinations || [],
      created_at: new Date(),
      updated_at: new Date()
    };

    // Insert the list
    const { data, error } = await this.supabase
      .from('destination_lists')
      .insert(listToCreate)
      .select()
      .single();

    return { data, error };
  }


  async getUserLists(userId: string): Promise<{ data: DestinationList[] | null, error: any }> {
    const { data, error } = await this.supabase
      .from('destination_lists')
      .select('*')
      .eq('user_id', userId);

    return { data, error };
  }

  // Add these additional methods for list management
  async getListDetails(listId: number, userId: string): Promise<{ data: DestinationListWithDetails | null, error: any }> {
    const { data, error } = await this.supabase
      .from('destination_lists')
      .select(`
        *,
        destinations(*)
      `)
      .eq('id', listId)
      .eq('user_id', userId)
      .single();

    return { data, error };
  }

  async updateDestinationList(listId: number, userId: string, updates: Partial<DestinationList>): Promise<{ data: DestinationList | null, error: any }> {
    // Validate user ownership
    const { data: existingList, error: checkError } = await this.supabase
      .from('destination_lists')
      .select('*')
      .eq('id', listId)
      .eq('user_id', userId)
      .single();

    if (!existingList) {
      return { data: null, error: 'List not found or unauthorized' };
    }

    // Validate destination existence if destinations are being modified
    if (updates.destinations) {
      for (const destination of updates.destinations) {
        const { data: destCheck } = await this.searchDestinations(destination);
        if (!destCheck || destCheck.length === 0) {
          return { data: null, error: `Destination ${destination} does not exist` };
        }
      }
    }

    const updateData = {
      ...updates,
      updated_at: new Date()
    };

    const { data, error } = await this.supabase
      .from('destination_lists')
      .update(updateData)
      .eq('id', listId)
      .select()
      .single();

    return { data, error };
  }


  async deleteDestinationList(listId: number, userId: string): Promise<{ success: boolean, error: any }> {
    const { error } = await this.supabase
      .from('destination_lists')
      .delete()
      .eq('id', listId)
      .eq('user_id', userId);

    return { 
      success: !error, 
      error 
    };
  }


  // *** List reviews *** //
  async addListReview(review: Partial<ListReview>): Promise<{ data: ListReview | null, error: any }> {
    // Validate review data
    if (!review.list_id || !review.user_id || !review.rating) {
      return { data: null, error: 'Missing required review information' };
    }
  
    const reviewToCreate = {
      ...review,
      created_at: new Date()
    };
  
    const { data, error } = await this.supabase
      .from('list_reviews')
      .insert(reviewToCreate)
      .select()
      .single();
  
    return { data, error };
  }
  
  async getListReviews(listId: number): Promise<{ data: ListReview[] | null, error: any }> {
    const { data, error } = await this.supabase
      .from('list_reviews')
      .select('*')
      .eq('list_id', listId)
      .order('created_at', { ascending: false });
  
    return { data, error };
  }
}